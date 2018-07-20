import { IEntity, IVersionable, IDocument, IAddress } from './base';

import { IContract } from './contract';
import { IServiceArea } from './service-area';
import { IUserPhone } from './user-phone';
import { IAuthUser } from './auth-user';
import { IImage } from './image';

export interface IUser extends IEntity, IVersionable {
    FirstName: string;
    LastName: string;
    Email: string;
    AuthUserId: number;
    ImageId?: number;
    AddressId?: number;

    // reverse nav
    Contracts?: IContract[];
    Documents?: IDocument[];
    ServiceAreas?: IServiceArea[];
    UserPhones?: IUserPhone[];

    // foreign keys
    Address?: IAddress;
    AuthUser?: IAuthUser;
    Image?: IImage;
}
