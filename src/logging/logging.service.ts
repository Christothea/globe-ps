import { Logger, Injectable, Scope } from '@nestjs/common';

/**
 * @class
 * @name LoggingService
 */
@Injectable({ scope: Scope.TRANSIENT })
export class LoggingService extends Logger {
    error(message: any, trace?: string, context?: string): void {
        super.error(message, trace, context);
    }

    log(message: any, context?: string): void {
        super.log(message, context);
    }

    warn(message: any, context?: string): void {
        super.warn(message, context);
    }

    debug(message: any, context?: string): void {
        super.debug(message, context);
    }

    verbose(message: any, context?: string): void {
        super.verbose(message, context);
    }
}
