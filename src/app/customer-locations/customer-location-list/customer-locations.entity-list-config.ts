import {
    IEntityListConfig,
    IEntityListColumn,
} from '@mt-ng2/entity-list-module';
import { ICustomerLocation } from '../../model/interfaces/customer-location';

export class CustomerLocationsEntityListConfig implements IEntityListConfig {
    columns: IEntityListColumn[];

    constructor(toggleArchiveStatus: Function) {
        this.columns = [
            {
                accessors: ['Name'],
                name: 'Location Name',
            },
            {
                accessors: ['Customer', 'Name'],
                name: 'Customer',
            },

            {
                accessors: ['ServiceArea', 'Name'],
                name: 'Service Area',
            },
            {
                accessors: [],
                name: 'Address',
                pipes: ['address'],
            },
            {
                accessorFunction: function(
                    customerLocation: ICustomerLocation,
                ): string {
                    if (customerLocation.Archived) {
                        return 'Restore';
                    } else {
                        return 'Archive';
                    }
                },
                linkFunction: function(
                    customerLocation: ICustomerLocation,
                ): void {
                    toggleArchiveStatus(customerLocation);
                },

                name: 'Archive',
            },
        ];
    }
}
