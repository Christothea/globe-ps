import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../../enums/payment-status.enum';
import { PaymentRequestDto } from './payment-request.dto';

export class PaymentDto extends PaymentRequestDto {
    constructor(partial: Partial<PaymentDto> = {}) {
        super();
        Object.assign(this, partial);
    }

    /**
     * @property
     * @public
     * @name id
     * @type UUID v4
     * @description Payment unique identifier
     */
    @ApiProperty({
        name: 'id',
        type: String,
        description: 'Payment unique identifier',
    })
    public id: string;

    /**
     * @property
     * @public
     * @name status
     * @type PaymentStatus enum
     * @description Payment statuc
     */
    @ApiProperty({
        name: 'status',
        required: true,
        enum: PaymentStatus,
        type: PaymentStatus,
        default: PaymentStatus.Created,
        description: 'Payment status',
    })
    public status: PaymentStatus;

    /**
     * @property
     * @public
     * @name created
     * @type Date
     * @description Payment created date time
     */
    @ApiProperty({
        name: 'created',
        type: Date,
        description: 'Payment created date time',
    })
    public created: Date;

    /**
     * @property
     * @public
     * @name updated
     * @type Date
     * @description Payment updated date time
     */
    @ApiProperty({
        name: 'updated',
        type: Date,
        description: 'Payment updated date time',
    })
    public updated: Date;
}
