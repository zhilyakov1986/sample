import { IEntity, IAddress } from './base';

import { IContactPhone } from './contact-phone';
import { ICustomer } from './customer';
import { IContactStatus } from './contact-status';

export interface IContact extends IEntity {
    FirstName: string;
    LastName: string;
    Title: string;
    Email: string;
    AddressId?: number;
    StatusId: number;

    // reverse nav
    ContactPhones?: IContactPhone[];
    Customers?: ICustomer[];

    // foreign keys
    Address?: IAddress;
    ContactStatus?: IContactStatus;
}
