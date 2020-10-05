import * as crypto from 'crypto';
import { BeforeCreate, BeforeUpdate, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from '../../enums/user-role.enum';
import { Account } from './account.model';

@Table
export class User extends Model {

  constructor(partial: Partial<User> = {}) {
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

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
    defaultValue: UserRole.Client,
  })
  public role: UserRole;

  @Column({
    unique: { name: 'unique_username', msg: 'Unique constraint violation' },
    allowNull: false,
    type: DataType.STRING(30),
  })
  public username: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(255),
  })
  public get password(): string {
    return this.getDataValue('password');
  }

  public set password(value: string) {
    this.setDataValue('password', value);
  }

  @Column
  public get salt(): string {
    return this.getDataValue('salt');
  }

  public set salt(value: string) {
    this.setDataValue('salt', value);
  }

  public generateSalt() {
    return crypto.randomBytes(16).toString('base64');
  }

  public encryptPassword(plainText, salt) {
    return crypto
      .createHash('RSA-SHA256')
      .update(plainText)
      .update(salt)
      .digest('hex');
  }

  @BeforeUpdate
  @BeforeCreate
  static setSaltAndPassword(user: User) {
    if (user.changed('password')) {
      user.salt = user.generateSalt();
      user.password = user.encryptPassword(user.password, user.salt);
    }
  }

  public validatePassword(enteredPassword): boolean {
    return this.encryptPassword(enteredPassword, this.salt) === this.password;
  }

  @HasMany(() => Account, 'userId')
  public accounts: Account[];

  @Column({
    defaultValue: true,
    type: DataType.BOOLEAN,
  })
  public enabled?: boolean;
}
