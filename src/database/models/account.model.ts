import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Currency } from '../../enums/currency.enum';
import { Payment } from './payment.model';
import { User } from './user.model';

@Table
export class Account extends Model {
    constructor(partial: Partial<Account> = {}) {
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

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    public userId: string;

    @BelongsTo(() => User, { foreignKey: 'userId', targetKey: 'id' })
    public user: User;

    @Column({
        defaultValue: 0,
        type: DataType.DECIMAL,
    })
    public balance: number;

    @Column({
        defaultValue: 0,
        type: DataType.DECIMAL,
    })
    public reseved: number;

    @Column({
        type: DataType.VIRTUAL(DataType.DECIMAL, ['balance', 'reseved']),
    })
    get netBalance(): number {
        return this.balance - this.reseved;
    }

    @Column({
        defaultValue: Currency.USD,
        type: DataType.ENUM(...Object.values(Currency)),
    })
    public currency: Currency;

    @Column({
        defaultValue: true,
        type: DataType.BOOLEAN,
    })
    public enabled: boolean;

    @HasMany(() => Payment, 'payerId')
    public payments: Payment[];
}
