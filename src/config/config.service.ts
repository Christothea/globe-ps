import { ShutdownSignal } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { AuthConfig } from '../auth/auth-config';
import { DatabaseConfig } from '../database/database-config';
import { LoggingService } from '../logging/logging.service';
import { UserRequestDto } from '../users/dto/user-request.dto';
import { AppEnvVars, ApplicationEnvironment, EnvConfig } from './app-env';


/**
 * @class
 * @static
 * @name ConfigService
 * @description Reads the application environment variables and exposes to the rest of the application
 */
export class ConfigService {
    /**
     * @property
     * @public
     * @static
     * @type ApplicationEnvironment
     * @name AppEnv
     * @description Application Environment Variables
     */
    public static AppEnv: ApplicationEnvironment;

    private static loggingService: LoggingService = new LoggingService(ConfigService.name);

    /**
     * @name init
     * @public
     * @static
     * @description Uses dotenv package to read the environment variables from .env file into the process.env
     * @throws Config validation error: <error message>
     * @returns void
     */
    public static init(): void {
        let envFile;
        try {
            envFile = fs.readFileSync(`.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`);
        } catch (ex) {
            this.loggingService.error('Read .env file failed', ex.stack, ConfigService.name);
            return;
        }
        const config = dotenv.parse(envFile);
        this.extractOptions(this.validateOptions(config));

        Object.keys(config).forEach(key => {
            if (key in process.env) {
                config[key] = process.env[key];
            }
        });

        this.loggingService.log(this.AppEnv, ConfigService.name);
    }

    /**
     * @name validateOptions
     * @private
     * @static
     * @description Validates Environment variables
     * @param config 
     * @returns EnvConfig
     */
    private static validateOptions(config: EnvConfig): EnvConfig {
        const { error, value: validatedEnvConfig } = AppEnvVars.validate(
            config,
        );
        if (error) {
            throw new Error(`Config validation error: ${error.message}`);
        }

        // Validate AuthConfig
        try {
            const authConfig: AuthConfig = JSON.parse(validatedEnvConfig.AUTH_CONFIG);

            if (!authConfig.tokenSecretKey || !authConfig.tokenExpiryTimeInHours) {
                throw new Error('Config AUTH_CONFIG validation error');
            }

        } catch (ex) {
            throw new Error('Config AUTH_CONFIG validation error');
        }

        // Validate DatabaseConfig
        try {
            const dbConfig: DatabaseConfig = JSON.parse(validatedEnvConfig.DATABASE_CONFIG);

            if (!dbConfig.host || !dbConfig.port) {
                throw new Error('Config DATABASE_CONFIG validation error');
            }

        } catch (ex) {
            throw new Error('Config DATABASE_CONFIG validation error');
        }

        // Validate SYS_ADMIN
        try {
            const sysAdminUser: UserRequestDto = JSON.parse(validatedEnvConfig.SYS_ADMIN);

            if (!sysAdminUser.username || !sysAdminUser.password) {
                throw new Error('Config SYS_ADMIN validation error');
            }

        } catch (ex) {
            throw new Error('Config DATABASE_CONFIG validation error');
        }

        // Validate Application Shutdown Signals
        try {
            const appSignals: string[] = validatedEnvConfig.APP_SHUTDOWN_SIGNALS ? JSON.parse(validatedEnvConfig.APP_SHUTDOWN_SIGNALS) : [];

            for (const signal of appSignals) {
                if (!Object.keys(ShutdownSignal).includes(signal)) {
                    throw new Error(`${signal} is not supported`);
                }
            }
        } catch (ex) {
            throw ex;
        }

        return validatedEnvConfig;
    }

    /**
     * @name validateOptions
     * @private
     * @static
     * @description Extracts Environment variables from EnvConfig key/value pairs into the AppEnv object
     * @param config
     * @returns void
     */
    private static extractOptions(config: EnvConfig): void {
        this.AppEnv = {
            APP_NAME: config.APP_NAME,
            APP_HOST: config.APP_HOST,
            APP_PORT: Number(config.APP_PORT),
            APP_SHUTDOWN_SIGNALS: JSON.parse(config.APP_SHUTDOWN_SIGNALS) as ShutdownSignal[],
            AUTH_CONFIG: JSON.parse(config.AUTH_CONFIG) as AuthConfig,
            DATABASE_CONFIG: JSON.parse(config.DATABASE_CONFIG) as DatabaseConfig,
            SYS_ADMIN: JSON.parse(config.SYS_ADMIN) as UserRequestDto,
        };
    }
}