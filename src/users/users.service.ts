import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Account } from '../database/models/account.model';
import { Payment } from '../database/models/payment.model';
import { ConfigService } from '../config/config.service';
import { User } from '../database/models/user.model';
import { Repositories } from '../database/repositories.enum';
import { HttpErrorMsgDto } from '../http-errors/dto/http-error-msg.dto';
import { HttpErrorCodeToMsgDto } from '../http-errors/http-code-message.mapper';
import { LoggingService } from '../logging/logging.service';
import { UserRequestDto } from './dto/user-request.dto';
import { UserDto } from './dto/user.dto';
import { UserMapper } from './user.mapper';

@Injectable()
export class UsersService {
  constructor(
    @Inject(Repositories.USERS_REPOSITORY) private userModel: typeof User,
    private readonly loggingService: LoggingService,
  ) {
    this.loggingService.setContext(UsersService.name);
  }

  public async init(callback: () => void) {
    try {
      const sysAdmin: User = await this.findByUsername(ConfigService.AppEnv.SYS_ADMIN.username);
      if (!sysAdmin) {
        await this.create(ConfigService.AppEnv.SYS_ADMIN);
      }
    } catch { }

    callback();
  }

  public async create(userRequestDto: UserRequestDto): Promise<UserDto> {
    this.loggingService.verbose(`create: ${userRequestDto.toString()}`);

    try {
      const user: User = await this.userModel.create(UserMapper.userRequestDtoToModel(userRequestDto));

      if (!user) {
        this.loggingService.warn(`create: DB Action Failed for ${userRequestDto.toString()}`);
        throw new InternalServerErrorException(HttpErrorCodeToMsgDto.ERR_INTERNAL_SERVER_ERROR);
      } else {
        return UserMapper.userModelToDto(user);
      }
    } catch (ex) {
      if ((ex.name === 'SequelizeUniqueConstraintError')) {
        this.loggingService.warn(`create: DB Action Unique Constraint Violation ${userRequestDto.toString()}`, ex.stack);
        const httpErrorDto: HttpErrorMsgDto = new HttpErrorMsgDto({ ...HttpErrorCodeToMsgDto.ERR_VALIDATION });
        httpErrorDto.details.push({ message: `'username' already in use`, path: ['username'], value: userRequestDto.username });
        throw new BadRequestException(httpErrorDto);
      }
      this.loggingService.error(`create: DB Action Exception for ${userRequestDto.toString()}`, ex.stack);
      throw ex;
    }
  }

  public async findAll(): Promise<UserDto[]> {
    try {
      return (await this.userModel.findAll())?.map(user => UserMapper.userModelToDto(user));
    } catch (ex) {
      this.loggingService.error(`findAll: DB Action Exception`, ex.stack);
      throw ex;
    }
  }

  public async findByUserId(userId: string): Promise<User> {
    try {
      return await this.userModel.findOne({
        where: {
          id: userId,
        },
      });
    } catch (ex) {
      this.loggingService.error(`findByUserId ${userId}: DB Action Exception`, ex.stack);
      throw ex;
    }
  }

  public async findByUsername(username: string): Promise<User> {
    try {
      return await this.userModel.findOne({
        where: {
          username,
        },
      });
    } catch (ex) {
      this.loggingService.error(`findByUsername ${username}: DB Action Exception`, ex.stack);
      throw ex;
    }
  }

  public async findByUserPayments(userId: string, paymentId?: string): Promise<User> {
    try {
      return await this.userModel.findOne({
        where: {
          id: userId,
        },
        include: [{
          model: Account,
          required: true,
          include: [{
            model: Payment,
            required: true,
          }],
        }],
      });
    } catch (ex) {
      this.loggingService.error(`findByUserPayments ${userId}: DB Action Exception`, ex.stack);
      throw ex;
    }
  }

  public async findByUserPayment(userId: string, paymentId: string): Promise<User> {
    try {
      return await this.userModel.findOne({
        where: {
          id: userId,
        },
        include: [{
          model: Account,
          required: true,
          include: [{
            model: Payment,
            required: true,
            where: {
              id: paymentId,
            },
          }],
        }],
      });
    } catch (ex) {
      this.loggingService.error(`findByUserPayments ${userId}: DB Action Exception`, ex.stack);
      throw ex;
    }
  }

  public async findByUserAccounts(userId: string): Promise<User> {
    try {
      return await this.userModel.findOne({
        where: {
          id: userId,
        },
        include: [{
          model: Account,
          required: true,
        }],
      });
    } catch (ex) {
      this.loggingService.error(`findByUserAccounts ${userId}: DB Action Exception`, ex.stack);
      throw ex;
    }
  }

  public async findByUserAccount(userId: string, accountId: string): Promise<User> {
    try {
      return await this.userModel.findOne({
        where: {
          id: userId,
        },
        include: [{
          model: Account,
          required: true,
          where: {
            id: accountId,
          },
        }],
      });
    } catch (ex) {
      this.loggingService.error(`findByUserAccount ${userId}: DB Action Exception`, ex.stack);
      throw ex;
    }
  }
}
