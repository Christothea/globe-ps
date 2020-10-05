import { User } from '../database/models/user.model';
import { UserRequestDto } from './dto/user-request.dto';
import { UserDto } from './dto/user.dto';

/**
 * @class
 * @name UserMapper
 * @description Maps User Db Models to UserDtos and the opposite
 */
export class UserMapper {

    public static userModelToDto(user: User): UserDto {
        return user ? new UserDto({
            id: user.id,
            username: user.username,
            role: user.role,
            enabled: user.enabled,
        }) : undefined;
    }

    public static userRequestDtoToModel(userRequestDto: UserRequestDto): User {
        return userRequestDto ? new User({
            username: userRequestDto.username,
            password: userRequestDto.password,
            role: userRequestDto.role,
        }) : undefined;
    }
}
