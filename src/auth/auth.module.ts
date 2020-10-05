import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccountsController } from '../accounts/accounts.controller';
import { ConfigService } from '../config/config.service';
import { LoggingModule } from '../logging/logging.module';
import { PaymentsController } from '../payments/payments.controller';
import { UsersController } from '../users/users.controller';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from './auth.mw';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';

function jwtProvider() {
    return {
        secret: ConfigService.AppEnv.AUTH_CONFIG.tokenSecretKey,
        signOptions: { expiresIn: ConfigService.AppEnv.AUTH_CONFIG.tokenExpiryTimeInHours + 'h' },
    };
}

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt', session: true }),
        JwtModule.registerAsync({
            imports: [],
            useFactory: jwtProvider,
            inject: [],
        }),
        UsersModule,
        LoggingModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        AuthMiddleware,
        JwtStrategy,
    ],
    exports: [AuthService, AuthMiddleware],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes(AccountsController, UsersController, PaymentsController);
    }
}