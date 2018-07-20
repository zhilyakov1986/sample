import { IEntity, IVersionable, IDocument, INote } from './base';

import { IContact } from './contact';
import { IContract } from './contract';
import { ICustomerAddress } from './customer-address';
import { ICustomerLocation } from './customer-location';
import { ICustomerPhone } from './customer-phone';
import { ICustomerSource } from './customer-source';
import { ICustomerStatus } from './customer-status';

export interface ICustomer extends IEntity, IVersionable {
    Name: string;
    StatusId: number;
    SourceId: number;

    // reverse nav
    Contacts?: IContact[];
    Contracts?: IContract[];
    CustomerAddresses?: ICustomerAddress[];
    CustomerLocations?: ICustomerLocation[];
    CustomerPhones?: ICustomerPhone[];
    Documents?: IDocument[];
    Notes?: INote[];

    // foreign keys
    CustomerSource?: ICustomerSource;
    CustomerStatus?: ICustomerStatus;
}
