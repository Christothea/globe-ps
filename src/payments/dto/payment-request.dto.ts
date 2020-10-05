import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { Currency } from '../../enums/currency.enum';
import { PaymentMethod } from '../../enums/payment-method.enum';
import { PaymentSystem } from '../../enums/payment-system.enum';

/**
 * @dto
 * @name PaymentRequestDto
 * @description Payment Creation Request Data Transfer Object
 */
export class PaymentRequestDto {
    constructor(partial: Partial<PaymentRequestDto> = {}) {
        Object.assign(this, partial);
    }

    /**
     * @property
     * @public
     * @name payeeId
     * @type UUID v4
     * @description Payee Account Id
     */
    @ApiProperty({
        name: 'payeeId',
        required: true,
        type: String,
        description: 'Payee Account Id of type UUID v4',
    })
    @IsNotEmpty()
    @IsUUID(4)
    public payeeId: string;

    /**
     * @property
     * @public
     * @name payerId
     * @type UUID v4
     * @description Payer Account Id
     */
    @ApiProperty({
        name: 'payerId',
        required: true,
        type: String,
        description: 'Payer Account Id of type UUID v4',
    })
    @IsNotEmpty()
    @IsUUID(4)
    public payerId: string;

    /**
     * @property
     * @public
     * @name paymentSystem
     * @type PaymentSystem enum
     * @description Payment system
     */
    @ApiProperty({
        name: 'paymentSystem',
        required: true,
        enum: PaymentSystem,
        type: PaymentSystem,
        description: 'Payment System',
    })
    @IsNotEmpty()
    @IsEnum(PaymentSystem)
    public paymentSystem: PaymentSystem;

    /**
     * @property
     * @public
     * @name paymentMethod
     * @type PaymentMethod enum
     * @description Payment method
     */
    @ApiProperty({
        name: 'paymentMethod',
        required: true,
        enum: PaymentMethod,
        type: PaymentMethod,
        description: 'Payment method',
    })
    @IsNotEmpty()
    @IsEnum(PaymentMethod)
    public paymentMethod: PaymentMethod;

    /**
     * @property
     * @public
     * @name amount
     * @type decimal(2)
     * @description Payment currency
     */
    @ApiProperty({
        name: 'amount',
        required: true,
        type: Number,
        description: 'Payment Amount of type Decimal with max 2 decimal points',
    })
    @IsNotEmpty()
    @IsDecimal({ decimal_digits: '0,2' })
    public amount: number;

    /**
     * @property
     * @public
     * @name currency
     * @type Currency enum
     * @description Payment currency
     */
    @ApiProperty({
        name: 'currency',
        required: true,
        enum: Currency,
        type: Currency,
        default: Currency.USD,
        description: 'Payment Currency',
    })
    @IsNotEmpty()
    @IsEnum(Currency)
    public currency: Currency;

    /**
     * @property
     * @public
     * @name comment
     * @type String
     * @description Payment optional comment, max 100 chars
     */
    @ApiProperty({
        name: 'comment',
        required: false,
        type: String,
        description: 'Payment comment of Maximum Length: 100 chars',
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    public comment?: string;

    public toString() {
        return `PaymentRequestDto[payerID: ${this.payerId}, payeeId: ${this.payeeId}, paymentSystem: ${this.paymentSystem}, paymentMethod: ${this.paymentMethod}, currency: ${this.currency}, amount: ${this.amount}, comment: ${this.comment}]`;
    }
}
