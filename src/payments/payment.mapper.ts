import { Payment } from '../database/models/payment.model';
import { PaymentRequestDto } from './dto/payment-request.dto';
import { PaymentDto } from './dto/payment.dto';

/**
 * @class
 * @name PaymentMapper
 * @description Maps Payment Db Models to PaymentDtos and the opposite
 */
export class PaymentMapper {
    public static paymentModelToDto(payment: Payment): PaymentDto {
        return payment ? new PaymentDto({
            id: payment.id,
            payeeId: payment.payeeId,
            payerId: payment.payerId,
            paymentSystem: payment.paymentSystem,
            paymentMethod: payment.paymentMethod,
            amount: payment.amount,
            currency: payment.currency,
            comment: payment.comment,
            status: payment.status,
            created: payment.createdAt,
            updated: payment.updatedAt,
        }) : undefined;
    }

    public static paymentRequestDtoToModel(paymentRequestDto: PaymentRequestDto): Payment {
        return paymentRequestDto ? new Payment({
            payeeId: paymentRequestDto.payeeId,
            payerId: paymentRequestDto.payerId,
            paymentSystem: paymentRequestDto.paymentSystem,
            paymentMethod: paymentRequestDto.paymentMethod,
            amount: paymentRequestDto.amount,
            currency: paymentRequestDto.currency,
            comment: paymentRequestDto.comment,
        }) : undefined;
    }
}
