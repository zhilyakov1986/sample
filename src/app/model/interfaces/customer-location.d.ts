import { IEntity, IVersionable, IDocument, IAddress } from './base';

import { ICustomerLocationAddress } from './customer-location-address';
import { ILocationService } from './location-service';
import { ICustomer } from './customer';
import { IServiceArea } from './service-area';

export interface ICustomerLocation extends IEntity, IVersionable {
    Name: string;
    CustomerId?: number;
    ServiceAreaId: number;
    AddressId?: number;
    Archived: boolean;

    // reverse nav
    CustomerLocationAddresses?: ICustomerLocationAddress[];
    Documents?: IDocument[];
    LocationServices?: ILocationService[];

    // foreign keys
    Address?: IAddress;
    Customer?: ICustomer;
    ServiceArea?: IServiceArea;
}
