import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty({
    name: 'expiresIn',
    type: Date,
  })
  expiresIn: Date;

  @ApiProperty({
    name: 'authToken',
    type: String,
  })
  authToken: string;

  constructor(partial: Partial<TokenDto> = {}) {
    Object.assign(this, partial);
  }
}
