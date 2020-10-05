import { BadRequestException, Injectable } from '@nestjs/common';
import { LoggingService } from '../logging/logging.service';
import { User } from '../database/models/user.model';
import { UserRole } from '../enums/user-role.enum';
import { HttpErrorMsgDto } from '../http-errors/dto/http-error-msg.dto';
import { HttpErrorCodeToMsgDto } from '../http-errors/http-code-message.mapper';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { PaymentRequestDto } from './dto/payment-request.dto';

@Injectable()
export class PaymentsValidator {
    constructor(
        private readonly usersService: UsersService,
        private readonly loggingService: LoggingService,
    ) {
    }

    public async validatePaymentRequest(user: UserDto, paymentRequestDto: PaymentRequestDto): Promise<void> {
        this.loggingService.verbose(`validatePaymentRequest: ${paymentRequestDto.toString()} requested by ${user.toString()}`);

        // If requesting user Role is Client then Payment Request payer account must belong to the requesting user
        if (user.role === UserRole.Client) {
            const userModel: User = await this.usersService.findByUserAccount(user.id, paymentRequestDto.payerId);

            if (!userModel) {
                this.loggingService.log(`validatePaymentRequest: payer account ${paymentRequestDto.payerId} not belong to ${user.toString()}`);

                const validationError: HttpErrorMsgDto = new HttpErrorMsgDto({ ...HttpErrorCodeToMsgDto.ERR_VALIDATION });
                validationError.details.push({
                    message: `'payerId' is not one of your accounts`,
                    path: ['payerId'],
                    value: paymentRequestDto.payerId,
                });
                throw new BadRequestException(validationError);
            }
        }

        if (paymentRequestDto.amount <= 0) {
            const validationError: HttpErrorMsgDto = new HttpErrorMsgDto({ ...HttpErrorCodeToMsgDto.ERR_VALIDATION });
            validationError.details.push({
                message: `'amount' field value must be greater than zero`,
                path: ['amount'],
                value: paymentRequestDto.amount,
            });
            throw new BadRequestException(validationError);
        }
    }
}
