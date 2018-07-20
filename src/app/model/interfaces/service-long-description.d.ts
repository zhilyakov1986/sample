import { IEntity } from './base';

import { IGood } from './good';

export interface IServiceLongDescription extends IEntity {
    Name: string;

    // reverse nav
    Goods?: IGood[];
}
