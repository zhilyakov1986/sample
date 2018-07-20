import { ICustomer } from '../interfaces/customer';
import { IAddress } from '../interfaces/base';

export interface ICustomer extends ICustomer {
    Addresses?: IAddress[];
}
