import { IAddress } from './base';

import { ICustomer } from './customer';

export interface ICustomerAddress {
    CustomerId: number;
    AddressId: number;
    IsPrimary: boolean;

    // foreign keys
    Address?: IAddress;
    Customer?: ICustomer;
}
