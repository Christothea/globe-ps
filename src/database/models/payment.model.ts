import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Currency } from '../../enums/currency.enum';
import { PaymentMethod } from '../../enums/payment-method.enum';
import { PaymentStatus } from '../../enums/payment-status.enum';
import { PaymentSystem } from '../../enums/payment-system.enum';
import { Account } from './account.model';

@Table
export class Payment extends Model {
    constructor(partial: Partial<Payment> = {}) {
        super();
        Object.assign(this, partial);
        this.id = uuidv4();
    }

    @Column({
        primaryKey: true,
        type: DataType.UUID,
        allowNull: false,
        autoIncrement: false,
        unique: { name: 'unique_id', msg: 'Unique constraint violation' },
    })
    public id: string;

    @ForeignKey(() => Account)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        references: {
            model: 'Accounts',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    public payeeId: string;

    @BelongsTo(() => Account, { foreignKey: 'payeeId', targetKey: 'id' })
    public payee: Account;

    @ForeignKey(() => Account)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        references: {
            model: 'Accounts',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    public payerId: string;

    @BelongsTo(() => Account, { foreignKey: 'payerId', targetKey: 'id' })
    public payer: Account;

    @Column({
        type: DataType.ENUM(...Object.values(PaymentSystem)),
        allowNull: false,
    })
    public paymentSystem: PaymentSystem;

    @Column({
        type: DataType.ENUM(...Object.values(PaymentMethod)),
        allowNull: false,
    })
    public paymentMethod: PaymentMethod;

    @Column({
        type: DataType.DECIMAL,
        allowNull: false,
    })
    public amount: number;

    @Column({
        type: DataType.ENUM(...Object.values(Currency)),
        allowNull: false,
    })
    public currency: Currency;

    @Column({
        type: DataType.STRING(100),
    })
    public comment: string;

    @Column({
        defaultValue: PaymentStatus.Created,
        type: DataType.ENUM(...Object.values(PaymentStatus)),
        allowNull: false,
    })
    public status: PaymentStatus;
}