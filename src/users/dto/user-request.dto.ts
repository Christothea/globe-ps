import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../../enums/user-role.enum';

/**
 * @dto
 * @name UserRequestDto
 * @description User Creation Request Data Transfer Object
 */
export class UserRequestDto {

    constructor(partial: Partial<UserRequestDto> = {}) {
        Object.assign(this, partial);
    }

    /**
     * @property
     * @public
     * @name username
     * @type String
     * @description Username: must be unique and up to 30 chars
     */
    @ApiProperty({
        name: 'username',
        required: true,
        type: String,
        description: 'Username: must be unique and up to 30 chars',
    })
    @IsNotEmpty()
    @IsString()
    public username: string;

    /**
     * @property
     * @public
     * @name password
     * @type String
     * @description User password: must be unique and up to 15 chars
     */
    @ApiProperty({
        name: 'password',
        required: true,
        type: String,
        description: 'User password: must be unique and up to 15 chars',
    })
    @IsNotEmpty()
    @IsString()
    public password: string;

    /**
     * @property
     * @public
     * @name role
     * @type UserRole enum
     * @description User role: infers the user permissions (authorization policy)
     */
    @ApiProperty({
        name: 'role',
        required: true,
        enum: UserRole,
        type: UserRole,
        default: UserRole.Client,
        description: 'User role: infers the user permissions (authorization policy)',
    })
    @IsNotEmpty()
    @IsEnum(UserRole)
    public role?: UserRole;

    public toString(): string {
        return `UserRequestDto[username: ${this.username}, role: ${this.role}]`;
    }
}
