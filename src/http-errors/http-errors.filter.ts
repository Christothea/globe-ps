import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { HttpErrorMsgDto } from './dto/http-error-msg.dto';
import { ValidationErrorDetailsDto } from './dto/validation-error-details.dto';
import { HttpErrorCodeToMsgDto } from './http-code-message.mapper';

/**
 * @class
 * @name HttpErrorsFilter
 * @description Catches the uncaught exceptions thrown from any Controller
 * @description Centralizes the error messages returned in each case
 */
@Catch()
export class HttpErrorsFilter implements ExceptionFilter {

  /**
   * @method
   * @name catch
   * @description catches, uncaught controllers exceptions
   */
  catch(error: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status: HttpStatus = (error instanceof HttpException) ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    let respError: HttpErrorMsgDto;

    if (!(error instanceof HttpException) || status === HttpStatus.INTERNAL_SERVER_ERROR) {
      respError = HttpErrorCodeToMsgDto.ERR_INTERNAL_SERVER_ERROR;
    } else if (status === HttpStatus.BAD_REQUEST) {
      respError = this.processBadRequestException(error as HttpException);
    } else if (!error.message.code) {
      switch (status) {
        case HttpStatus.UNAUTHORIZED:
          respError = HttpErrorCodeToMsgDto.ERR_UNAUTHORIZED;
          break;
        case HttpStatus.FORBIDDEN:
          respError = HttpErrorCodeToMsgDto.ERR_UNAUTHORIZED_NOT_ENOUGH_PERMISSIONS;
          break;
        default:
          respError = HttpErrorCodeToMsgDto.ERR_INTERNAL_SERVER_ERROR;
          break;
      }
    } else {
      respError = error.message;
    }


    return response.status(status).send(respError);
  }

  private processBadRequestException(error: HttpException): HttpErrorMsgDto {
    const respError: HttpErrorMsgDto = (error.message instanceof HttpErrorMsgDto) ? error.message : new HttpErrorMsgDto({...HttpErrorCodeToMsgDto.ERR_VALIDATION});

    if (Array.isArray(error.message.message)) {
      for (const errMsg of error.message.message) {
        if (!(errMsg instanceof ValidationError)) {
          continue;
        }

        const validationErrorDetails: ValidationErrorDetailsDto = {
          message: `'${errMsg.property}' field is required`,
          path: [errMsg.property],
          value: errMsg.target[errMsg.property],
        };

        respError.details.push(validationErrorDetails);
      }
    }

    return respError;
  }
}
