import { IEntityListConfig, IEntityListColumn } from '@mt-ng2/entity-list-module';
import { IUser } from '../../model/interfaces/user';

export class UsersEntityListConfig implements IEntityListConfig {
    columns: IEntityListColumn[];

    constructor() {
        this.columns = [
            {
                accessorFunction: function(user: IUser): string {
                    return `${user.FirstName} ${user.LastName}`;
                },
                name: 'Name',
            },
            {
                linkFunction: function(user: IUser): void {
                    window.open(`mailto:${user.Email}`);
                },
                name: 'Email',
            },
            {
                accessors: [],
                name: 'Address',
                pipes: ['address'],
            },
        ];
    }
}
