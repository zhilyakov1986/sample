import { IEntity, IAddress } from './base';


export interface IState extends IEntity {
    StateCode: string;
    Name: string;
    TaxRate?: number;

    // reverse nav
    Addresses?: IAddress[];
}
