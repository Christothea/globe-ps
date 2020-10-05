import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Currency } from '../../enums/currency.enum';

/**
 * @dto
 * @name AccountRequestDto
 * @description Account Creation Request Data Transfer Object
 */
export class AccountRequestDto {
    constructor(partial: Partial<AccountRequestDto> = {}) {
        Object.assign(this, partial);
    }

    /**
     * @property
     * @public
     * @name currency
     * @type Currency enum
     * @description Account currency
     */
    @ApiProperty({
        name: 'currency',
        required: false,
        enum: Currency,
        type: Currency,
        default: Currency.USD,
        description: 'Account Currency',
    })
    @IsOptional()
    @IsEnum(Currency)
    public currency?: Currency;

    public toString() {
        return `AccountRequestDto[Currency: ${this.currency}]`;
    }
}
