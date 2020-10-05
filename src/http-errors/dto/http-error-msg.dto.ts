import { ApiProperty } from '@nestjs/swagger';
import { HttpErrorCode } from './http-error-code.enum';
import { ValidationErrorDetailsDto } from './validation-error-details.dto';

export class HttpErrorMsgDto {
    constructor(partial: Partial<HttpErrorMsgDto> = {}) {
        Object.assign(this, partial);
        this.details = new Array();
    }

    @ApiProperty({
        name: 'currency',
        enum: HttpErrorCode,
        type: HttpErrorCode,
        default: HttpErrorCode.ERR_INTERNAL_SERVER_ERROR,
        description: 'Error Code',
    })
    public code: HttpErrorCode;

    @ApiProperty({
        name: 'message',
        type: String,
        description: 'Error Message',
    })
    public message: string;

    @ApiProperty({
        name: 'details',
        required: false,
        isArray: true,
        type: ValidationErrorDetailsDto,
        description: 'Validation Error Details',
    })
    public details?: ValidationErrorDetailsDto[];
}
