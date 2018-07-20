import { IEntity } from './base';

import { IContract } from './contract';

export interface IContractStatus extends IEntity {
    Name: string;

    // reverse nav
    Contracts?: IContract[];
}
