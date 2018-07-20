import { IEntity } from './base';

import { IContract } from './contract';
import { IGood } from './good';

export interface IServiceDivision extends IEntity {
    Name: string;

    // reverse nav
    Contracts?: IContract[];
    Goods?: IGood[];
}
