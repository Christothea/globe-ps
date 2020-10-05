import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AccountDto } from '../accounts/dto/account.dto';
import { UsersAuthorizationGuard } from '../auth/auth-users.guard';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { UserRole } from '../enums/user-role.enum';
import { HttpErrorMsgDto } from '../http-errors/dto/http-error-msg.dto';
import { LoggingService } from '../logging/logging.service';
import { UserDto } from '../users/dto/user.dto';
import { UserRoles } from '../utils/user-role.decorator';
import { HttpReqUser } from '../utils/user.decorator';
import { PaymentRequestDto } from './dto/payment-request.dto';
import { PaymentDto } from './dto/payment.dto';
import { PaymentsService } from './payments.service';

@Controller('v1/payments')
@ApiTags('Payments Service Requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, UsersAuthorizationGuard)
export class PaymentsController {
    constructor(
        private readonly paymentsService: PaymentsService,
        private readonly loggingService: LoggingService) {
        this.loggingService.setContext(PaymentsController.name);
    }

    @Get()
    @ApiOperation(
        {
            summary: 'Returns all Payments',
            description: 'If requesting user has the BackOffice role then will return the payments of all users accounts else will return only the payments of the requesting user',
        })
    @ApiOkResponse({ type: AccountDto, isArray: true })
    @ApiInternalServerErrorResponse({ type: HttpErrorMsgDto })
    @ApiUnauthorizedResponse({ type: HttpErrorMsgDto })
    @UserRoles(UserRole.BackOffice, UserRole.Client)
    async getPayments(@HttpReqUser() user: UserDto): Promise<PaymentDto[]> {
        this.loggingService.verbose(`get Payments requested by ${user.id}`);
        return await this.paymentsService.findAllByUser(user);
    }

    @Get(':paymentId')
    @ApiOperation(
        {
            summary: 'Gets the payment with the given id',
        })
    @ApiOkResponse({ type: AccountDto, isArray: true })
    @ApiInternalServerErrorResponse({ type: HttpErrorMsgDto })
    @ApiUnauthorizedResponse({ type: HttpErrorMsgDto })
    @UserRoles(UserRole.BackOffice, UserRole.Client)
    async getPayment(@HttpReqUser() user: UserDto, @Param('paymentId') paymentId: string): Promise<PaymentDto> {
        this.loggingService.verbose(`get Payment <${paymentId}> requested by ${user.id}`);
        return await this.paymentsService.findById(user, paymentId);
    }

    @Post()
    @ApiOperation(
        {
            summary: 'Creates a new Payment',
        })
    @ApiBody({ type: PaymentRequestDto })
    @ApiCreatedResponse({ type: PaymentDto })
    @ApiBadRequestResponse({ type: HttpErrorMsgDto })
    @ApiInternalServerErrorResponse({ type: HttpErrorMsgDto })
    @ApiUnauthorizedResponse({ type: HttpErrorMsgDto })
    @UserRoles(UserRole.BackOffice, UserRole.Client)
    async create(@HttpReqUser() user: UserDto, @Body() paymentRequest: PaymentRequestDto): Promise<PaymentDto> {
        this.loggingService.verbose(`create Payment ${paymentRequest.toString()} equested by ${user.id}`);
        return await this.paymentsService.create(user, paymentRequest);
    }

    @Put(':paymentId/approve')
    @ApiOperation(
        {
            summary: 'Approves a Payment',
        })
    @ApiParam({ name: 'paymentId', type: 'string' })
    @ApiBadRequestResponse({ type: HttpErrorMsgDto })
    @ApiInternalServerErrorResponse({ type: HttpErrorMsgDto })
    @ApiUnauthorizedResponse({ type: HttpErrorMsgDto })
    @UserRoles(UserRole.BackOffice)
    async approvePayment(@HttpReqUser() user: UserDto, @Param('paymentId') paymentId: string): Promise<void> {
        this.loggingService.verbose(`approve Payment <${paymentId}> equested by ${user.id}`);
        await this.paymentsService.approve(user, paymentId);
    }

    @Put(':paymentId/cancel')
    @ApiOperation(
        {
            summary: 'Cancels a Payment',
        })
    @ApiParam({ name: 'paymentId', type: 'string' })
    @ApiBadRequestResponse({ type: HttpErrorMsgDto })
    @ApiInternalServerErrorResponse({ type: HttpErrorMsgDto })
    @ApiUnauthorizedResponse({ type: HttpErrorMsgDto })
    @UserRoles(UserRole.BackOffice, UserRole.Client)
    async cancelPayment(@HttpReqUser() user: UserDto, @Param('paymentId') paymentId: string): Promise<void> {
        this.loggingService.verbose(`cancel Payment <${paymentId}> equested by ${user.id}`);
        await this.paymentsService.cancel(user, paymentId);
    }
}