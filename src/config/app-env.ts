import * as Joi from '@hapi/joi';
import { ShutdownSignal } from '@nestjs/common';
import { AuthConfig } from '../auth/auth-config';
import { DatabaseConfig } from '../database/database-config';
import { UserRole } from '../enums/user-role.enum';
import { UserRequestDto } from '../users/dto/user-request.dto';

/**
 * @file app-env.ts
 * @description Wraps the schemas of the Application Environment Variables
 */

/**
 * @type Record<string, any>
 * @name EnvConfig
 * @description Defines Environment Configuration type (Key/Value) redords
 */
type EnvConfig = Record<string, any>;

/**
 * @class
 * @name ApplicationEnvironment
 * @description Application Environment Variables data structure
 */
class ApplicationEnvironment {
    public APP_NAME: string;
    public APP_HOST: string;
    public APP_PORT: number;
    public APP_SHUTDOWN_SIGNALS: ShutdownSignal[];
    public AUTH_CONFIG: AuthConfig;
    public DATABASE_CONFIG: DatabaseConfig;
    public SYS_ADMIN: UserRequestDto;
}

const getDefaultAuthConfig = (): string => {
    return JSON.stringify(new AuthConfig({
        tokenSecretKey: 'jwt-secret-key-12345!!!',
        tokenExpiryTimeInHours: 1,
    }));
};

const getDefaultDbConfig = (): string => {
    return JSON.stringify(new DatabaseConfig({
        host: 'localhost',
        port: 3306,
        username: 'globe-ps-app',
        password: 'dbpswd1234',
        database: 'globe-ps',
    }));
};

const getDefaultSysAdmin = (): string => {
    return JSON.stringify(new UserRequestDto({
        username: 'sysadmin',
        password: 'p@ss22!',
        role: UserRole.Admin,
    }));
};

/**
 * @name AppEnvVars
 * @type Joi.ObjectSchema
 * @description Defines the schema and default values for the Application Environment Variables
 */
const AppEnvVars: Joi.ObjectSchema = Joi.object({
    APP_NAME: Joi.string().default('Globe-PS'),
    APP_HOST: Joi.string().default('0.0.0.0'),
    APP_PORT: Joi.number().default(3008),
    APP_SHUTDOWN_SIGNALS: Joi.string().default(JSON.stringify([ShutdownSignal.SIGINT])),
    AUTH_CONFIG: Joi.string().default(getDefaultAuthConfig()),
    DATABASE_CONFIG: Joi.string().default(getDefaultDbConfig()),
    SYS_ADMIN: Joi.string().default(getDefaultSysAdmin()),
});

export { EnvConfig, AppEnvVars, ApplicationEnvironment };
