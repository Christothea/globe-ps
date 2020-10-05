import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../enums/user-role.enum';

/**
 * @dto
 * @name UserDto
 * @description User information Data Transfer Object
 */
export class UserDto {
    constructor(partial: Partial<UserDto> = {}) {
        Object.assign(this, partial);
    }

    /**
     * @property
     * @public
     * @name id
     * @type UUID v4
     * @description User Unique Id
     */
    @ApiProperty({
        name: 'id',
        type: String,
        description: 'User unique identifier',
    })
    public id: string;

    /**
     * @property
     * @public
     * @name role
     * @type UserRole
     * @description User role: infers the user permissions (authorization policy)
     */
    @ApiProperty({
        name: 'role',
        enum: UserRole,
        type: UserRole,
        description: 'User role: infers the user permissions (authorization policy)',
    })
    public role: UserRole;

    /**
     * @property
     * @public
     * @name username
     * @type string
     * @description Username
     */
    @ApiProperty({
        name: 'username',
        type: String,
        description: 'Username',
    })
    public username: string;

    /**
     * @property
     * @public
     * @name enabled
     * @type boolean
     * @description Indicates whether the User is enabled
     */
    @ApiProperty({
        name: 'enabled',
        type: Boolean,
        description: 'Indicates whether the User is enabled',
    })
    public enabled: boolean;

    public toString(): string {
        return `User[id: ${this.id}, username: ${this.username}, role: ${this.role}]`;
    }
}
