import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '../config/config.service';
import { Account } from './models/account.model';
import { Payment } from './models/payment.model';
import { User } from './models/user.model';

export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            const sequelize = new Sequelize({
                logging: false,
                sync: { alter: true },
                dialect: 'mariadb',
                host: ConfigService.AppEnv.DATABASE_CONFIG.host,
                port: ConfigService.AppEnv.DATABASE_CONFIG.port,
                username: ConfigService.AppEnv.DATABASE_CONFIG.username,
                password: ConfigService.AppEnv.DATABASE_CONFIG.password,
                database: ConfigService.AppEnv.DATABASE_CONFIG.database,
            });
            sequelize.addModels([User, Account, Payment]);
            await sequelize.sync();
            return sequelize;
        },
    },
];
