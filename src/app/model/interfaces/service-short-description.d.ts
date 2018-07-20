import { IEntity } from './base';

import { IGood } from './good';

export interface IServiceShortDescription extends IEntity {
    Name: string;

    // reverse nav
    Goods?: IGood[];
}
