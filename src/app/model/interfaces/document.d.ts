import { IEntity } from './base';

import { ICustomer } from './customer';
import { ICustomerLocation } from './customer-location';
import { IGood } from './good';
import { IUser } from './user';

export interface IDocument extends IEntity {
    Name: string;
    DateUpload: Date;
    UploadedBy?: number;
    FilePath: string;

    // reverse nav
    Customers?: ICustomer[];
    CustomerLocations?: ICustomerLocation[];
    Goods?: IGood[];
    Users?: IUser[];

    // foreign keys
    User?: IUser;
}
