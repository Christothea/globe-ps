import { Account } from '../database/models/account.model';
import { AccountRequestDto } from './dto/account-request.dto';
import { AccountDto } from './dto/account.dto';

/**
 * @class
 * @name AccountMapper
 * @description Maps Account Db Models to AccountDtos and the opposite
 */
export class AccountMapper {
    public static accountModelToDto(account: Account): AccountDto {
        return account ? new AccountDto({
            id: account.id,
            balance: account.balance,
            reseved: account.reseved,
            netBalance: account.netBalance,
            currency: account.currency,
            enabled: account.enabled,
        }) : undefined;
    }

    public static accountRequestDtoToModel(accountRequestDto: AccountRequestDto): Account {
        return accountRequestDto ? new Account({
            currency: accountRequestDto.currency,
        }) : undefined;
    }
}