import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { DatabaseModule } from '../database/database.module';
import { paymentsProviders } from '../database/payments.provider';
import { LoggingModule } from '../logging/logging.module';
import { PaymentsController } from '../payments/payments.controller';
import { UsersModule } from '../users/users.module';
import { PaymentsService } from './payments.service';
import { PaymentsValidator } from './payments.validator';

@Module({
  imports: [
    LoggingModule,
    DatabaseModule,
    UsersModule,
    AccountsModule,
  ],
  providers: [
    PaymentsService,
    PaymentsValidator,
    ...paymentsProviders,
  ],
  exports: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}