import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { PaymentStatus } from '../enums/payment-status.enum';
import { AccountsService } from '../accounts/accounts.service';
import { Account } from '../database/models/account.model';
import { Payment } from '../database/models/payment.model';
import { User } from '../database/models/user.model';
import { Repositories } from '../database/repositories.enum';
import { PaymentSystem } from '../enums/payment-system.enum';
import { UserRole } from '../enums/user-role.enum';
import { HttpErrorMsgDto } from '../http-errors/dto/http-error-msg.dto';
import { HttpErrorCodeToMsgDto } from '../http-errors/http-code-message.mapper';
import { LoggingService } from '../logging/logging.service';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { PaymentRequestDto } from './dto/payment-request.dto';
import { PaymentDto } from './dto/payment.dto';
import { PaymentMapper } from './payment.mapper';
import { PaymentsValidator } from './payments.validator';

@Injectable()
export class PaymentsService {
    constructor(
        @Inject(Repositories.SEQUELIZE)
        private readonly dataStore: Sequelize,
        @Inject(Repositories.PAYMENTS_REPOSITORY)
        private readonly paymentModel: typeof Payment,
        private readonly paymentsValidator: PaymentsValidator,
        private readonly loggingService: LoggingService,
        private readonly usersService: UsersService,
        private readonly accountsService: AccountsService,
    ) {
        this.loggingService.setContext(PaymentsService.name);
    }

    //#region Public Methods
    public async create(user: UserDto, paymentRequestDto: PaymentRequestDto): Promise<PaymentDto> {
        this.loggingService.verbose(`create: ${paymentRequestDto.toString()}`);

        // 1. Request validation
        await this.paymentsValidator.validatePaymentRequest(user, paymentRequestDto);

        // 2. Proceed with payment creation
        return paymentRequestDto.paymentSystem === PaymentSystem.InternalTransfer ?
            await this.processInternalTransfer(paymentRequestDto) :
            await this.processExternalPayment(paymentRequestDto);
    }

    public async approve(user: UserDto, paymentId: string): Promise<void> {
        this.loggingService.verbose(`approve: <${paymentId}> requested by ${user.toString()}`);

        const payment: PaymentDto = await this.findById(user, paymentId);

        if (!payment) {
            const validationError: HttpErrorMsgDto = new HttpErrorMsgDto({ ...HttpErrorCodeToMsgDto.ERR_VALIDATION });
            validationError.details.push({
                message: `Payment not exists`,
                path: ['paymentId'],
                value: paymentId,
            });
            throw new BadRequestException(validationError);
        }

        if (payment.status === PaymentStatus.Approved) {
            return;
        }

        payment.paymentSystem === PaymentSystem.InternalTransfer ?
            await this.processApproveInternalTransfer(payment) :
            await this.processApproveExternalPayment(payment);
    }

    public async cancel(user: UserDto, paymentId: string): Promise<void> {
        this.loggingService.verbose(`cancel: <${paymentId}> requested by ${user.toString()}`);

        const payment: PaymentDto = await this.findById(user, paymentId);

        if (!payment) {
            const validationError: HttpErrorMsgDto = new HttpErrorMsgDto({ ...HttpErrorCodeToMsgDto.ERR_VALIDATION });
            validationError.details.push({
                message: `Payment not exists`,
                path: ['paymentId'],
                value: paymentId,
            });
            throw new BadRequestException(validationError);
        }

        if (payment.status === PaymentStatus.Cancelled) {
            return;
        }

        payment.paymentSystem === PaymentSystem.InternalTransfer ?
            await this.processCancelInternalTransfer(payment) :
            await this.processCancelExternalPayment(payment);
    }

    public async findAllByUser(user: UserDto): Promise<PaymentDto[]> {

        try {
            if (user.role === UserRole.BackOffice) {
                return (await this.paymentModel.findAll())?.map(payment => PaymentMapper.paymentModelToDto(payment));
            }

            const userModel: User = await this.usersService.findByUserPayments(user.id);

            let userPayments: PaymentDto[] = new Array();

            userModel?.accounts?.forEach((account: Account) => {
                if (account.payments) {
                    userPayments = userPayments.concat(account.payments.map(paymentModel => {
                        return PaymentMapper.paymentModelToDto(paymentModel);
                    }));
                }
            });

            return userPayments;
        } catch (ex) {
            this.loggingService.error(`findAllByUser: DB Action Exception`, ex.stack);
            throw ex;
        }
    }

    public async findById(user: UserDto, paymentId: string): Promise<PaymentDto> {

        try {
            let paymentModel: Payment;
            if (user.role === UserRole.BackOffice) {
                paymentModel = await this.paymentModel.findOne({
                    where: {
                        id: paymentId,
                    },
                });
            } else {

                const userModel: User = await this.usersService.findByUserPayment(user.id, paymentId);

                if (userModel?.accounts) {
                    for (const account of userModel?.accounts) {
                        if (account.payments?.length > 0) {
                            paymentModel = account.payments[0];
                            break;
                        }
                    }
                }
            }

            if (!paymentModel) {
                const validationError: HttpErrorMsgDto = new HttpErrorMsgDto({ ...HttpErrorCodeToMsgDto.ERR_VALIDATION });
                validationError.details.push({
                    message: `Invalid paymentId`,
                    path: ['paymentId'],
                    value: paymentId,
                });
                throw new BadRequestException(validationError);
            }

            return PaymentMapper.paymentModelToDto(paymentModel);
        } catch (ex) {
            this.loggingService.error(`findById: DB Action Exception`, ex.stack);
            throw ex;
        }
    }
    //#endregion

    //#region Private methods
    private async processInternalTransfer(paymentRequestDto: PaymentRequestDto): Promise<PaymentDto> {
        try {
            return await this.dataStore.transaction({
                autocommit: true,
                type: Transaction.TYPES.EXCLUSIVE,
                isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
            }, async (t): Promise<PaymentDto> => {
                // 1. Check payer account balance
                const payerAccount: Account = await this.accountsService.findById(paymentRequestDto.payerId, t);

                if (payerAccount?.netBalance < paymentRequestDto.amount) {
                    const validationError: HttpErrorMsgDto = new HttpErrorMsgDto({ ...HttpErrorCodeToMsgDto.ERR_VALIDATION });
                    validationError.details.push({
                        message: `Not Enough Balance ('amount' greater than netBalance)`,
                        path: ['netBalance'],
                        value: payerAccount.netBalance,
                    });
                    throw new BadRequestException(validationError);
                }

                // 2. Create payment
                let payment: Payment = PaymentMapper.paymentRequestDtoToModel(paymentRequestDto);
                payment = await this.paymentModel.create(payment, { transaction: t });

                if (!payment) {
                    this.loggingService.warn(`processInternalTransfer: DB Action Failed for ${paymentRequestDto.toString()}`);
                    throw new InternalServerErrorException(HttpErrorCodeToMsgDto.ERR_INTERNAL_SERVER_ERROR);
                }

                // 3. Update Payer Account Reserved amount
                payerAccount.reseved = Number(payerAccount.reseved) + Number(paymentRequestDto.amount);
                await this.accountsService.update(payerAccount, t);

                return PaymentMapper.paymentModelToDto(payment);
            });

        } catch (ex) {
            if (!(ex instanceof BadRequestException || ex instanceof InternalServerErrorException)) {
                this.loggingService.error(`processInternalTransfer: DB Action Exception for ${paymentRequestDto.toString()}`, ex.stack);
            }
            throw ex;
        }
    }

    private async processExternalPayment(paymentRequestDto: PaymentRequestDto): Promise<PaymentDto> {
        try {
            let payment: Payment = PaymentMapper.paymentRequestDtoToModel(paymentRequestDto);
            payment = await this.paymentModel.create(payment);

            if (!payment) {
                this.loggingService.warn(`processExternalPayment: DB Action Failed for ${paymentRequestDto.toString()}`);
                throw new InternalServerErrorException(HttpErrorCodeToMsgDto.ERR_INTERNAL_SERVER_ERROR);
            } else {
                return PaymentMapper.paymentModelToDto(payment);
            }
        } catch (ex) {
            this.loggingService.error(`processExternalPayment: DB Action Exception for ${paymentRequestDto.toString()}`, ex.stack);
            throw ex;
        }
    }

    private async processApproveInternalTransfer(payment: PaymentDto): Promise<void> {
        try {
            await this.dataStore.transaction({
                autocommit: true,
                type: Transaction.TYPES.EXCLUSIVE,
                isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
            }, async (t): Promise<void> => {
                // 1. Update payment status
                payment.status = PaymentStatus.Approved;
                const paymentUpdateRes = await this.paymentModel.update(
                    {
                        ...payment,
                    },
                    {
                        where: { id: payment.id, status: PaymentStatus.Created },
                        transaction: t,
                    });

                if (paymentUpdateRes[0] <= 0) {
                    throw new NotAcceptableException(HttpErrorCodeToMsgDto.ERR_CANNOT_APPROVE);
                }

                // 2. Update accounts balances
                const payerAccount: Account = await this.accountsService.findById(payment.payerId, t);
                payerAccount.reseved = Number(payerAccount.reseved) - Number(payment.amount);
                payerAccount.balance = Number(payerAccount.balance) - Number(payment.amount);
                await this.accountsService.update(payerAccount, t);

                const payeeAccount: Account = await this.accountsService.findById(payment.payeeId, t);
                payeeAccount.balance = Number(payeeAccount.balance) + Number(payment.amount);
                await this.accountsService.update(payeeAccount, t);
            });

        } catch (ex) {
            if (!(ex instanceof BadRequestException || ex instanceof InternalServerErrorException || ex instanceof NotAcceptableException)) {
                this.loggingService.error(`processApproveInternalTransfer: DB Action Exception for ${payment.toString()}`, ex.stack);
            }
            throw ex;
        }
    }

    private async processApproveExternalPayment(payment: PaymentDto): Promise<void> {
        try {
            await this.dataStore.transaction({
                autocommit: true,
                type: Transaction.TYPES.EXCLUSIVE,
                isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
            }, async (t): Promise<void> => {
                // 1. Update payment status
                payment.status = PaymentStatus.Approved;
                const paymentUpdateRes = await this.paymentModel.update(
                    {
                        ...payment,
                    },
                    {
                        where: { id: payment.id, status: PaymentStatus.Created },
                        transaction: t,
                    });

                if (paymentUpdateRes[0] <= 0) {
                    throw new NotAcceptableException(HttpErrorCodeToMsgDto.ERR_CANNOT_APPROVE);
                }

                // 2. Update accounts balances
                const payeeAccount: Account = await this.accountsService.findById(payment.payeeId, t);
                payeeAccount.balance = Number(payeeAccount.balance) + Number(payment.amount);
                await this.accountsService.update(payeeAccount);
            });

        } catch (ex) {
            if (!(ex instanceof BadRequestException || ex instanceof InternalServerErrorException || ex instanceof NotAcceptableException)) {
                this.loggingService.error(`processApproveExternalPayment: DB Action Exception for ${payment.toString()}`, ex.stack);
            }
            throw ex;
        }
    }

    private async processCancelInternalTransfer(payment: PaymentDto): Promise<void> {
        try {
            await this.dataStore.transaction({
                autocommit: true,
                type: Transaction.TYPES.EXCLUSIVE,
                isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
            }, async (t): Promise<void> => {
                // 1. Update payment status
                payment.status = PaymentStatus.Cancelled;
                const paymentUpdateRes = await this.paymentModel.update(
                    {
                        ...payment,
                    },
                    {
                        where: { id: payment.id, status: PaymentStatus.Created },
                        transaction: t,
                    });

                if (paymentUpdateRes[0] <= 0) {
                    throw new NotAcceptableException(HttpErrorCodeToMsgDto.ERR_CANNOT_CANCEL);
                }

                // 2. Update payer account reserved
                const payerAccount: Account = await this.accountsService.findById(payment.payerId, t);
                payerAccount.reseved = Number(payerAccount.reseved) - Number(payment.amount);
                await this.accountsService.update(payerAccount, t);
            });

        } catch (ex) {
            if (!(ex instanceof BadRequestException || ex instanceof InternalServerErrorException || ex instanceof NotAcceptableException)) {
                this.loggingService.error(`processCancelInternalTransfer: DB Action Exception for ${payment.toString()}`, ex.stack);
            }
            throw ex;
        }
    }

    private async processCancelExternalPayment(payment: PaymentDto): Promise<void> {
        try {
            await this.dataStore.transaction({
                autocommit: true,
                type: Transaction.TYPES.EXCLUSIVE,
                isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
            }, async (t): Promise<void> => {
                // 1. Update payment status
                payment.status = PaymentStatus.Cancelled;
                const paymentUpdateRes = await this.paymentModel.update(
                    {
                        ...payment,
                    },
                    {
                        where: { id: payment.id, status: PaymentStatus.Created },
                        transaction: t,
                    });

                if (paymentUpdateRes[0] <= 0) {
                    throw new NotAcceptableException(HttpErrorCodeToMsgDto.ERR_CANNOT_CANCEL);
                }
            });

        } catch (ex) {
            if (!(ex instanceof BadRequestException || ex instanceof InternalServerErrorException || ex instanceof NotAcceptableException)) {
                this.loggingService.error(`processCancelExternalPayment: DB Action Exception for ${payment.toString()}`, ex.stack);
            }
            throw ex;
        }
    }
    //#endregion
}
