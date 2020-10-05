import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthenticateDto {
  @ApiProperty({
    name: 'username',
    type: String,
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    name: 'password',
    type: String,
  })
  @IsNotEmpty()
  password: string;
}
