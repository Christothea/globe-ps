import { Body, Controller, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthenticateDto } from './dto/authentication.dto';
import { TokenDto } from './dto/token.dto';

@ApiTags('Authentication')
@Controller('v1')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('authenticate')
    @ApiOperation({ summary: 'Authenticates User and gives the Bearer Token' })
    @ApiBody({ type: AuthenticateDto })
    @ApiCreatedResponse({ type: TokenDto })
    async authenticate(@Body() loginDto: AuthenticateDto): Promise<TokenDto> {
        const token = await this.authService.login(loginDto);

        if (!token) {
            throw new UnauthorizedException('User credentials were incorrect.');
        }
        return token;
    }
}
