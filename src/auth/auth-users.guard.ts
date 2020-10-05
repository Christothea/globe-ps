
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserDto } from '../users/dto/user.dto';
import { ControllersMetaKeys } from '../utils/controllers-meta-keys.enum';

@Injectable()
export class UsersAuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(ControllersMetaKeys.roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: UserDto = request.user;
    return roles.includes(user.role);
  }
}
