import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ActiveUserData } from '../../../interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '../../../iam.constants';
import { PermissionType } from '../../permission.type';
import { PERMISSIONS_KEY } from '../../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextPermissions = this.reflector.getAllAndOverride<
      PermissionType[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!contextPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY] as ActiveUserData;

    if (!user) return false;

    return contextPermissions.every((permission) =>
      user.permissions?.includes(permission),
    );
  }
}
