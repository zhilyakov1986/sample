import { IEntity } from './base';

import { ICustomer } from './customer';

export interface INote extends IEntity {
    Title: string;
    NoteText: string;

    // reverse nav
    Customers?: ICustomer[];
}
