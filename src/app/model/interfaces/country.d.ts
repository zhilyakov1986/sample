import { IAddress } from './base';


export interface ICountry {
    CountryCode: string;
    Alpha3Code: string;
    Name: string;

    // reverse nav
    Addresses?: IAddress[];
}
