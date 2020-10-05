import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Account } from '../database/models/account.model';
import { Repositories } from '../database/repositories.enum';
import { UserRole } from '../enums/user-role.enum';
import { HttpErrorCodeToMsgDto } from '../http-errors/http-code-message.mapper';
import { LoggingService } from '../logging/logging.service';
import { UserDto } from '../users/dto/user.dto';
import { AccountMapper } from './account.mapper';
import { AccountRequestDto } from './dto/account-request.dto';
import { AccountDto } from './dto/account.dto';

@Injectable()
export class AccountsService {
    constructor(
        @Inject(Repositories.ACCOUNTS_REPOSITORY) private accountModel: typeof Account,
        private readonly loggingService: LoggingService,
    ) {
        this.loggingService.setContext(AccountsService.name);
    }

    public async create(userId: string, accountRequestDto: AccountRequestDto): Promise<AccountDto> {
        this.loggingService.verbose(`create: ${accountRequestDto.toString()}`);

        try {
            let account: Account = AccountMapper.accountRequestDtoToModel(accountRequestDto);
            account.userId = userId;
            account = await this.accountModel.create(account);

            if (!account) {
                this.loggingService.warn(`create: DB Action Failed for ${accountRequestDto.toString()}`);
                throw new InternalServerErrorException(HttpErrorCodeToMsgDto.ERR_INTERNAL_SERVER_ERROR);
            } else {
                return AccountMapper.accountModelToDto(account);
            }
        } catch (ex) {
            this.loggingService.error(`create: DB Action Exception for ${accountRequestDto.toString()}`, ex.stack);
            throw ex;
        }
    }

    public async update(accountDto: AccountDto, transaction?): Promise<void> {
        this.loggingService.verbose(`update: PaymentId: ${accountDto.toString()}`);

        try {
            await this.accountModel.update(
                {
                    ...accountDto,
                },
                {
                    where: { id: accountDto.id },
                    transaction,
                });

        } catch (ex) {
            this.loggingService.error(`update: DB Action Exception for ${accountDto.toString()}`, ex.stack);
            throw ex;
        }
    }

    public async findByUserId(user: UserDto): Promise<AccountDto[]> {

        try {

            if (user.role === UserRole.BackOffice) {
                return (await this.accountModel.findAll())?.map(account => AccountMapper.accountModelToDto(account));
            } else {
                return (await this.accountModel.findAll({
                    where: {
                        userId: user.id,
                    },
                }))?.map(account => AccountMapper.accountModelToDto(account));
            }

        } catch (ex) {
            this.loggingService.error(`findByUsername: DB Action Exception`, ex.stack);
            throw ex;
        }
    }

    public async findById(accountId: string, transaction?): Promise<Account> {

        try {
            return await this.accountModel.findOne({
                where: {
                    id: accountId,
                },
                transaction,
            });

        } catch (ex) {
            this.loggingService.error(`findById: DB Action Exception`, ex.stack);
            throw ex;
        }
    }
}
