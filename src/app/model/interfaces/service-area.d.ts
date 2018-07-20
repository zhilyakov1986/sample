import { IEntity } from './base';

import { IContract } from './contract';
import { ICustomerLocation } from './customer-location';
import { IUser } from './user';

export interface IServiceArea extends IEntity {
    Name: string;

    // reverse nav
    Contracts?: IContract[];
    CustomerLocations?: ICustomerLocation[];
    Users?: IUser[];
}
