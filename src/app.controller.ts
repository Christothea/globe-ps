import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Main Application')
export class AppController {
  constructor() {}

  @Get('ping')
  @ApiOperation({ summary: 'Check if application is alive, just returns "Ping"' })
  ping(): string {
    return 'Ping';
  }
}
