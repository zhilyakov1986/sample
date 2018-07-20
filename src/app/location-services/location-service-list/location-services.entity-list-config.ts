import {
    IEntityListConfig,
    IEntityListColumn,
} from '@mt-ng2/entity-list-module';
import { ILocationService } from '../../model/interfaces/location-service';
import { IGood } from '../../model/interfaces/good';

export class LocationServicesEntityListConfig implements IEntityListConfig {
    columns: IEntityListColumn[];

    constructor(
        showShortDescription: Function,
        showLongDescription: Function,
        getTaxPerService: Function,
        getTotalLineItem: Function,
    ) {
        this.columns = [
            {
                accessors: ['CustomerLocation', 'Name'],
                name: 'Location Name',
            },
            {
                accessors: ['Good', 'Name'],
                name: 'Service Name',
            },
            {
                accessorFunction: function(): string {
                    return `Show Description`;
                },
                linkFunction: function(
                    locationService: ILocationService,
                ): void {
                    showShortDescription(locationService);
                },
                name: 'Short Description',
            },
            {
                accessorFunction: function(): string {
                    return `Show Description`;
                },
                linkFunction: function(
                    locationService: ILocationService,
                ): void {
                    showLongDescription(locationService);
                },
                name: 'Long Description',
            },
            {
                accessors: ['Good', 'Cost'],
                name: 'Cost',
            },
            {
                accessors: ['Good', 'UnitType', 'Name'],
                name: 'Unit',
            },
            {
                accessors: ['Quantity'],
                name: 'QTY',
            },
            {
                accessors: ['Price'],
                name: 'Price',
            },
            {
                accessorFunction: function(
                    locationService: ILocationService,
                ): string {
                    if (locationService.Good.Taxable) {
                        return getTaxPerService(locationService);
                    } else {
                        return 'Not Taxable';
                    }
                },
                name: 'Tax',
            },
            {
                accessorFunction: function(
                    locationService: ILocationService,
                ): string {
                    return getTotalLineItem(locationService);
                },
                name: 'Line Item Total',
            },
            {
                accessorFunction: function(
                    locationService: ILocationService,
                ): string {
                    if (locationService.Archived) {
                        return 'Yes';
                    } else {
                        return 'No';
                    }
                },
                name: 'Archived',
            },
        ];
    }
}
