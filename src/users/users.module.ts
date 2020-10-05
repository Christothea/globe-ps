import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from '../database/users.provider';
import { LoggingModule } from '../logging/logging.module';
import { LoggingService } from '../logging/logging.service';
import { UsersService } from '../users/users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    LoggingModule,
    DatabaseModule,
  ],
  providers: [
    UsersService,
    ...usersProviders,
  ],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly usersService: UsersService,
    private readonly loggingService: LoggingService,
  ) {
    this.loggingService.setContext(UsersModule.name);
  }
  onModuleInit() {
    this.loggingService.log('Init', this.constructor.name);
    return this.usersService.init(() => this.loggingService.log('Service Listening', this.constructor.name));
  }

  onModuleDestroy() {

  }
}