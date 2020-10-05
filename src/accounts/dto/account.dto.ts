import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '../../enums/currency.enum';

/**
 * @dto
 * @name AccountDto
 * @description Account information Data Transfer Object
 */
export class AccountDto {
    constructor(partial: Partial<AccountDto> = {}) {
        Object.assign(this, partial);
    }

    /**
     * @property
     * @public
     * @name id
     * @type UUID v4
     * @description Account unique identifier. To be used later on Payment-->PayeeId, PayerId
     */
    @ApiProperty({
        name: 'id',
        type: String,
        description: 'Account unique identifier. To be used later on Payment-->PayeeId, PayerId',
    })
    public id: string;

    /**
     * @property
     * @public
     * @name balance
     * @type decimal(2)
     * @description Account Balance of type Decimal with max 2 decimal points
     */
    @ApiProperty({
        name: 'balance',
        type: Number,
        description: 'Account Balance of type Decimal with max 2 decimal points',
    })
    public balance: number;

    /**
     * @property
     * @public
     * @name reserved
     * @type decimal(2)
     * @description Total amount of InternalTransfer payments which had been created but not yet approved or cancelled, of type Decimal with max 2 decimal points
     */
    @ApiProperty({
        name: 'reseved',
        type: Number,
        description: 'Total amount of InternalTransfer payments which had been created but not yet approved or cancelled, of type Decimal with max 2 decimal points',
    })
    public reseved: number;

    /**
     * @property
     * @public
     * @name netBalance
     * @type decimal(2)
     * @description Account (Balance - Reserved) of type Decimal with max 2 decimal points
     */
    @ApiProperty({
        name: 'netBalance',
        type: Number,
        description: 'Account (Balance - Reserved) of type Decimal with max 2 decimal points',
    })
    public netBalance: number;

    /**
     * @property
     * @public
     * @name currency
     * @type Currency enum
     * @description Account currency
     */
    @ApiProperty({
        name: 'currency',
        required: true,
        enum: Currency,
        type: Currency,
        default: Currency.USD,
        description: 'Account Currency',
    })
    public currency: Currency;

    /**
     * @property
     * @public
     * @name enabled
     * @type boolean
     * @description Indicates whether the Account is enabled
     */
    @ApiProperty({
        name: 'enabled',
        type: Boolean,
        description: 'Indicates whether the Account is enabled',
    })
    public enabled: boolean;
}