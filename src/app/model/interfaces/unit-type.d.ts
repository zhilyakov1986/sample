import { IEntity } from './base';

import { IGood } from './good';

export interface IUnitType extends IEntity {
    Name: string;

    // reverse nav
    Goods?: IGood[];
}
