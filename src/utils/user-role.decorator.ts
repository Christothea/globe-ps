
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';
import { ControllersMetaKeys } from './controllers-meta-keys.enum';

export const UserRoles = (...roles: UserRole[]) => SetMetadata(ControllersMetaKeys.roles, roles);