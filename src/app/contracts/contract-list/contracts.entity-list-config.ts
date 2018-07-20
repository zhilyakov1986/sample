import {
    IEntityListConfig,
    IEntityListColumn,
} from '@mt-ng2/entity-list-module';
import { IContract } from '../../model/interfaces/contract';
import { ICustomer } from '../../model/interfaces/customer';

export class ContractsEntityListConfig implements IEntityListConfig {
    columns: IEntityListColumn[];

    constructor(
        toggleArchiveStatus: Function,
        openCustomerLocationDialog: Function,
    ) {
        this.columns = [
            {
                name: 'Number',
            },
            {
                accessors: ['StartDate'],
                name: 'Start Date',
                pipes: ['date'],
            },
            {
                accessors: ['EndDate'],
                name: 'End Date',
                pipes: ['date'],
            },
            // {
            //     accessors: ['User', 'AuthUserId', 'RoleId'],
            //     name: 'User',
            // },
            {
                accessors: ['Customer', 'Name'],
                name: 'Customer',
            },
            {
                accessorFunction: function(): string {
                    return `Show List`;
                },
                linkFunction: function(contract: IContract): void {
                    openCustomerLocationDialog(contract);
                },
                name: 'CustomerLocations',
            },
            {
                accessors: ['ContractStatus', 'Name'],
                name: 'Status',
            },
            {
                accessors: ['ServiceDivision', 'Name'],
                name: 'Service Division',
            },
            {
                accessorFunction: function(contract: IContract): string {
                    if (contract.Archived) {
                        return 'Restore';
                    } else {
                        return 'Archive';
                    }
                },
                linkFunction: function(contract: IContract): void {
                    toggleArchiveStatus(contract);
                },
                name: 'Archived',
            },
        ];
    }
}
