import { IEntity, IAddress } from './base';

import { IContactPhone } from './contact-phone';
import { IContactStatus } from './contact-status';
import { ICustomer } from './customer';

export interface ICustomerContact extends IEntity {
    CustomerId: number;
    FirstName: string;
    LastName: string;
    Title: string;
    Email: string;
    AddressId?: number;
    StatusId: number;

    // reverse nav
    ContactPhones?: IContactPhone[];

    // foreign keys
    Address?: IAddress;
    ContactStatus?: IContactStatus;
    Customer?: ICustomer;
}
