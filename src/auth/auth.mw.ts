import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction } from 'express';
import { HttpErrorCodeToMsgDto } from '../http-errors/http-code-message.mapper';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const usertoken: string = req.headers['authorization'].replace('Bearer ', '');

        try {
            if (!this.jwtService.verify(
                usertoken,
                { secret: ConfigService.AppEnv.AUTH_CONFIG.tokenSecretKey },
            )) {
                throw new UnauthorizedException(HttpErrorCodeToMsgDto.ERR_UNAUTHORIZED);
            }

        } catch (ex) {
            if (ex.name === 'TokenExpiredError') {
                throw new UnauthorizedException(HttpErrorCodeToMsgDto.ERR_AUTH_TOKEN_EXPIRED);
            }
        }

        next();
    }
}
