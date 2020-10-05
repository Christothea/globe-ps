import { HttpErrorCode } from './dto/http-error-code.enum';
import { HttpErrorMsgDto } from './dto/http-error-msg.dto';

export const HttpErrorCodeToMsgDto: Record<HttpErrorCode, HttpErrorMsgDto> = {
    [HttpErrorCode.ERR_AUTH_TOKEN_EXPIRED]: {code: HttpErrorCode.ERR_AUTH_TOKEN_EXPIRED, message: 'Auth token expired'},
    [HttpErrorCode.ERR_CANNOT_APPROVE]: {code: HttpErrorCode.ERR_CANNOT_APPROVE, message: 'Cannot approve a payment that has already been cancelled'},
    [HttpErrorCode.ERR_CANNOT_CANCEL]: {code: HttpErrorCode.ERR_CANNOT_CANCEL, message: 'Cannot cancel a payment that has already been approved'},
    [HttpErrorCode.ERR_UNAUTHORIZED]: {code: HttpErrorCode.ERR_UNAUTHORIZED, message: 'No auth token provided'},
    [HttpErrorCode.ERR_UNAUTHORIZED_INVALID_USER]: {code: HttpErrorCode.ERR_UNAUTHORIZED_INVALID_USER, message: 'Invalid User'},
    [HttpErrorCode.ERR_UNAUTHORIZED_INVALID_PASSWORD]: {code: HttpErrorCode.ERR_UNAUTHORIZED_INVALID_PASSWORD, message: 'Invalid Password'},
    [HttpErrorCode.ERR_UNAUTHORIZED_NOT_ENOUGH_PERMISSIONS]: {code: HttpErrorCode.ERR_UNAUTHORIZED_NOT_ENOUGH_PERMISSIONS, message: 'Not Enough Permissions'},
    [HttpErrorCode.ERR_VALIDATION]: {code: HttpErrorCode.ERR_VALIDATION, message: 'Validation failed', details: []},
    [HttpErrorCode.ERR_INTERNAL_SERVER_ERROR]: {code: HttpErrorCode.ERR_INTERNAL_SERVER_ERROR, message: 'Please contact sys admin'},
};
