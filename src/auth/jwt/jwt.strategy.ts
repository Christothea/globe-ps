import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../config/config.service';
import { User } from '../../database/models/user.model';
import { HttpErrorCodeToMsgDto } from '../../http-errors/http-code-message.mapper';
import { LoggingService } from '../../logging/logging.service';
import { UserDto } from '../../users/dto/user.dto';
import { UserMapper } from '../../users/user.mapper';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    private usersService: UsersService,
    private loggingService: LoggingService) {

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ConfigService.AppEnv.AUTH_CONFIG.tokenSecretKey,
    });

    this.loggingService.setContext(JwtStrategy.name);
  }

  async validate(payload: JwtPayload): Promise<UserDto> {
    try {
      const user: User = await this.usersService.findByUsername(payload.identity);
      if (!user) {
        throw new UnauthorizedException(HttpErrorCodeToMsgDto.ERR_UNAUTHORIZED_INVALID_USER);
      }

      return UserMapper.userModelToDto(user);
    } catch (ex) {
      this.loggingService.error(`validate Exception: ${payload.identity}`, ex.stack);
      throw new InternalServerErrorException(HttpErrorCodeToMsgDto.ERR_INTERNAL_SERVER_ERROR);
    }
  }
}
