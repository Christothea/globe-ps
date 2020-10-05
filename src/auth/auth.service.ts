import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';
import { HttpErrorCodeToMsgDto } from '../http-errors/http-code-message.mapper';
import { ConfigService } from '../config/config.service';
import { User } from '../database/models/user.model';
import { LoggingService } from '../logging/logging.service';
import { UsersService } from '../users/users.service';
import { AuthenticateDto } from './dto/authentication.dto';
import { TokenDto } from './dto/token.dto';
import { JwtPayload } from './jwt/jwt-payload';

@Injectable()
export class AuthService {

  constructor(
    private loggingService: LoggingService,
    private usersService: UsersService,
    private jwtService: JwtService) {
      this.loggingService.setContext(AuthService.name);
  }

  async login(loginDto: AuthenticateDto): Promise<TokenDto> {
    const user = await this.validateUser(loginDto);

    return this.createUserToken(user);
  }

  private async createUserToken(user: User): Promise<TokenDto> {
    const payload: JwtPayload = {
      identity: user.username,
      id: user.id,
    };

    return new TokenDto({
      authToken: this.jwtService.sign(payload),
      expiresIn: moment().add(ConfigService.AppEnv.AUTH_CONFIG.tokenExpiryTimeInHours, 'hours').toDate(),
    });
  }

  private async validateUser(loginDto: AuthenticateDto): Promise<User> {

    const user: User = await this.usersService.findByUsername(loginDto.username.toLowerCase().trim());
    if (!user) {
      throw new UnauthorizedException(HttpErrorCodeToMsgDto.ERR_UNAUTHORIZED_INVALID_USER);
    }

    const match = user.validatePassword(loginDto.password);

    if (!match) {
      this.loggingService.warn(`Invalid User Password: ${loginDto.username}`);
      throw new UnauthorizedException(HttpErrorCodeToMsgDto.ERR_UNAUTHORIZED_INVALID_PASSWORD);
    }

    return user;
  }
}
