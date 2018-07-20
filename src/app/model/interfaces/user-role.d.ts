import { IEntity } from './base';

import { IAuthUser } from './auth-user';
import { IUserRoleClaim } from './user-role-claim';

export interface IUserRole extends IEntity {
    Name: string;
    Description: string;
    IsEditable: boolean;

    // reverse nav
    AuthUsers?: IAuthUser[];
    UserRoleClaims?: IUserRoleClaim[];
}
