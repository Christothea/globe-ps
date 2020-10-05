import { createParamDecorator } from '@nestjs/common';
import { UserDto } from '../users/dto/user.dto';

export const HttpReqUser = createParamDecorator((data, req): UserDto => {
  return req.user;
});
