import { IEntity } from './base';

import { IContact } from './contact';
import { ICustomerAddress } from './customer-address';
import { ICustomerLocation } from './customer-location';
import { ICustomerLocationAddress } from './customer-location-address';
import { IUser } from './user';
import { ICountry } from './country';
import { IState } from './state';

export interface IAddress extends IEntity {
    Address1: string;
    Address2: string;
    City: string;
    StateId?: number;
    Zip: string;
    CountryCode?: string;
    Province: string;

    // reverse nav
    Contacts?: IContact[];
    CustomerAddresses?: ICustomerAddress[];
    CustomerLocations?: ICustomerLocation[];
    CustomerLocationAddresses?: ICustomerLocationAddress[];
    Users?: IUser[];

    // foreign keys
    Country?: ICountry;
    State?: IState;
}
