/**
 * @enum
 * @name PaymentStatus
 * @description Payments Statuses List
 */
export enum PaymentStatus {
    /**
     * @name Created
     * @description Newly created payment, still pending for approval
     */
    Created = 'created',
    /**
     * @name Approved
     * @description Payment had been approved
     */
    Approved = 'approved',
    /**
     * @name Cancelled
     * @description Payment had been declined
     */
    Cancelled = 'cancelled',
}