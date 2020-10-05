import { Module } from '@nestjs/common';
import { accountsProviders } from '../database/accounts.provider';
import { DatabaseModule } from '../database/database.module';
import { LoggingModule } from '../logging/logging.module';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
    imports: [
        LoggingModule,
        DatabaseModule,
    ],
    providers: [
        AccountsService,
        ...accountsProviders,
    ],
    exports: [AccountsService],
    controllers: [AccountsController],
})
export class AccountsModule {}