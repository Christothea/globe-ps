import { IsNotEmpty } from 'class-validator';

export class AuthenticateDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
