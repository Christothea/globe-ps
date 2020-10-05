import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserRoles } from '../utils/user-role.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { UserRole } from '../enums/user-role.enum';
import { HttpErrorMsgDto } from '../http-errors/dto/http-error-msg.dto';
import { LoggingService } from '../logging/logging.service';
import { UserDto } from '../users/dto/user.dto';
import { HttpReqUser } from '../utils/user.decorator';
import { AccountsService } from './accounts.service';
import { AccountRequestDto } from './dto/account-request.dto';
import { AccountDto } from './dto/account.dto';
import { UsersAuthorizationGuard } from '../auth/auth-users.guard';

@Controller('v1/accounts')
@ApiTags('Accounts Management Service')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, UsersAuthorizationGuard)
export class AccountsController {
    constructor(
        private readonly accountsService: AccountsService,
        private readonly loggingService: LoggingService,
    ) {
        this.loggingService.setContext(AccountsController.name);
    }

    @Get()
    @ApiOperation({ summary: 'Returns all Accounts records related to the requesting user' })
    @ApiBearerAuth()
    @ApiOkResponse({ type: AccountDto, isArray: true })
    @ApiInternalServerErrorResponse({ type: HttpErrorMsgDto })
    @ApiUnauthorizedResponse({ type: HttpErrorMsgDto })
    @UserRoles(UserRole.BackOffice, UserRole.Client)
    async getAccounts(@HttpReqUser() user: UserDto): Promise<AccountDto[]> {
        this.loggingService.verbose(`get Accounts of ${user.id}`);
        return this.accountsService.findByUserId(user);
    }

    @Post()
    @ApiOperation(
        {
            summary: 'Creates a new account for the requesting user',
        })
    @ApiBearerAuth()
    @ApiBody({ type: AccountRequestDto })
    @ApiCreatedResponse({ type: AccountDto })
    @ApiBadRequestResponse({ type: HttpErrorMsgDto })
    @ApiInternalServerErrorResponse({ type: HttpErrorMsgDto })
    @ApiUnauthorizedResponse({ type: HttpErrorMsgDto })
    @UserRoles(UserRole.Client)
    async create(@HttpReqUser() user: UserDto, @Body() accountRequest: AccountRequestDto): Promise<AccountDto> {
        this.loggingService.verbose(`create Account ${accountRequest.toString()} for ${user.id}`);
        return this.accountsService.create(user.id, accountRequest);
    }
}
