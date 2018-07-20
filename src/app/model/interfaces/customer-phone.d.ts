import { IPhoneType } from './base';

import { ICustomer } from './customer';

export interface ICustomerPhone {
    CustomerId: number;
    Phone: string;
    Extension: string;
    PhoneTypeId: number;
    IsPrimary: boolean;

    // foreign keys
    Customer?: ICustomer;
    PhoneType?: IPhoneType;
}
