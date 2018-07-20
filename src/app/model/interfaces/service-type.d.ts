import { IEntity } from './base';

import { IGood } from './good';

export interface IServiceType extends IEntity {
    Name: string;

    // reverse nav
    Goods?: IGood[];
}
