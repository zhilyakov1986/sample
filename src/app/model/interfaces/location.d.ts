import { IEntity, IVersionable, IAddress } from './base';

import { IGood } from './good';
import { IState } from './state';

export interface ILocation extends IEntity, IVersionable {
    Name: string;
    GoodId: number;
    AddressId: number;
    Quantity: number;
    StateId: number;
    Total: number;
    Archived: boolean;

    // foreign keys
    Address?: IAddress;
    Good?: IGood;
    State?: IState;
}
