import {
    IEntityListConfig,
    IEntityListColumn,
} from '@mt-ng2/entity-list-module';
import { IGood } from '../../model/interfaces/good';
import { Injectable } from '@angular/core';

@Injectable()
export class GoodsEntityListConfig implements IEntityListConfig {
    columns: IEntityListColumn[];

    constructor(toggleArchiveStatus: Function) {
        this.columns = [
            {
                name: 'Name',
            },
            {
                accessors: ['ServiceDivision', 'Name'],
                name: 'Service Division',
            },
            {
                accessors: ['ServiceType', 'Name'],
                name: 'Service Type',
            },
            {
                accessorFunction: function(good: IGood): string {
                    if (good.Archived) {
                        return 'Restore';
                    } else {
                        return 'Archive';
                    }
                },
                linkFunction: function(good: IGood): void {
                    toggleArchiveStatus(good);

                },

                name: 'Archive',
            },
        ];
    }
}
