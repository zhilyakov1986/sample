 import { IEntityListConfig, IEntityListColumn } from '@mt-ng2/entity-list-module';

 export class CustomersEntityListConfig implements IEntityListConfig {
    columns: IEntityListColumn[];

    constructor() {
        this.columns = [
            {
                name: 'Name',
            },
            {
                accessors: ['CustomerPhones'],
                name: 'Phone',
                pipes: ['primary', 'phone'],
            },
            {
                accessors: ['CustomerSource', 'Name'],
                name: 'Source',
            },
            {
                accessors: ['CustomerStatus', 'Name'],
                name: 'Status',
            },
        ];
    }
}
