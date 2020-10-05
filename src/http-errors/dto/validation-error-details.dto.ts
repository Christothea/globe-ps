import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorDetailsDto {
    @ApiProperty({
        name: 'message',
        type: String,
        description: 'Validation Error Message',
    })
    public message: string;

    @ApiProperty({
        name: 'path',
        isArray: true,
        type: String,
        description: 'Fields on which validation failed',
    })
    public path: string[];

    @ApiProperty({
        name: 'value',
        type: Object,
        required: false,
        description: 'Object values',
    })
    public value?: any;
}