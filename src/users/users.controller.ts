import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UsersAuthorizationGuard } from '../auth/auth-users.guard';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { UserRole } from '../enums/user-role.enum';
import { HttpErrorMsgDto } from '../http-errors/dto/http-error-msg.dto';
import { LoggingService } from '../logging/logging.service';
import { UserRoles } from '../utils/user-role.decorator';
import { UserRequestDto } from './dto/user-request.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('v1/users')
@ApiTags('Users Service Requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, UsersAuthorizationGuard)
export class UsersController {
    constructor(
        private readonly userService: UsersService,
        private readonly loggingService: LoggingService,
    ) {
        this.loggingService.setContext(UsersController.name);
    }

    @Get()
    @ApiOperation({ summary: 'Returns all Users records' })
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserDto, isArray: true })
    @ApiInternalServerErrorResponse({ type: HttpErrorMsgDto })
    @ApiUnauthorizedResponse({ type: HttpErrorMsgDto })
    @UserRoles(UserRole.Admin)
    async getUsers(): Promise<UserDto[]> {
        this.loggingService.verbose('Get Users');
        return this.userService.findAll();
    }

    @Post()
    @ApiOperation(
        {
            summary: 'Creates a new user',
        })
    @ApiBearerAuth()
    @ApiBody({ type: UserRequestDto })
    @ApiCreatedResponse({ type: UserDto })
    @ApiBadRequestResponse({ type: HttpErrorMsgDto })
    @ApiInternalServerErrorResponse({ type: HttpErrorMsgDto })
    @ApiUnauthorizedResponse({ type: HttpErrorMsgDto })
    @UserRoles(UserRole.Admin)
    async create(@Body() userRequestDto: UserRequestDto): Promise<UserDto> {
        this.loggingService.verbose(`Create User: ${userRequestDto.toString()}`);
        return this.userService.create(userRequestDto);
    }
}