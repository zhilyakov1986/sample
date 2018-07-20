import { IEntity, IVersionable } from './base';

import { ILocationService } from './location-service';
import { IServiceArea } from './service-area';
import { IContractStatus } from './contract-status';
import { ICustomer } from './customer';
import { IServiceDivision } from './service-division';
import { IUser } from './user';

export interface IContract extends IEntity, IVersionable {
    Number?: string;
    StartDate: Date;
    EndDate: Date;
    CustomerId: number;
    UserId?: number;
    StatusId: number;
    ServiceDivisionId: number;
    Archived: boolean;

    // reverse nav
    LocationServices?: ILocationService[];
    ServiceAreas?: IServiceArea[];

    // foreign keys
    ContractStatus?: IContractStatus;
    Customer?: ICustomer;
    ServiceDivision?: IServiceDivision;
    User?: IUser;
}
