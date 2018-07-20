import { IEntity, IVersionable } from './base';

import { IContract } from './contract';
import { ICustomerLocation } from './customer-location';
import { IGood } from './good';

export interface ILocationService extends IEntity, IVersionable {
    CustomerLocationId: number;
    ContractId: number;
    GoodId: number;
    Quantity: number;
    Price: number;
    Archived: boolean;
    ShortDescription: string;
    LongDescription: string;

    // foreign keys
    Contract?: IContract;
    CustomerLocation?: ICustomerLocation;
    Good?: IGood;
}
