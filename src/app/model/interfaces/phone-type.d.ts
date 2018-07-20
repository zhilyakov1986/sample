import { IEntity } from './base';

import { IContactPhone } from './contact-phone';
import { ICustomerPhone } from './customer-phone';
import { IUserPhone } from './user-phone';

export interface IPhoneType extends IEntity {
    Name: string;

    // reverse nav
    ContactPhones?: IContactPhone[];
    CustomerPhones?: ICustomerPhone[];
    UserPhones?: IUserPhone[];
}
