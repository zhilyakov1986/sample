import { IEntity } from './base';

import { ICustomer } from './customer';

export interface ICustomerSource extends IEntity {
    Name: string;
    Sort: number;

    // reverse nav
    Customers?: ICustomer[];
}
