import { IAddress } from './base';

import { ICustomerLocation } from './customer-location';

export interface ICustomerLocationAddress {
    CustomerLocationId: number;
    AddressId: number;
    IsPrimary: boolean;

    // foreign keys
    Address?: IAddress;
    CustomerLocation?: ICustomerLocation;
}
