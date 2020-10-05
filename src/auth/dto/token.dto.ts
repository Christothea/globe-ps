export class TokenDto {
  expiresIn: Date;
  authToken: string;

  constructor(partial: Partial<TokenDto> = {}) {
    Object.assign(this, partial);
  }
}
