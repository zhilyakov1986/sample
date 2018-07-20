import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/debounceTime';

import { ExtraSearchParams, SearchParams } from '@mt-ng2/common-classes';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { IItemSelectedEvent } from '@mt-ng2/entity-list-module';

import { UserService } from '../user.service';
import { IUser } from '../../model/interfaces/user';
import { ClaimTypes } from '../../model/ClaimTypes';
import { UsersEntityListConfig } from './users.entity-list-config';
import { entityListModuleConfig } from '../../common/shared.module';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
    users: IUser[];
    currentPage = 1;
    total: number;
    canAddUser = false;
    query: string;

    entityListConfig = new UsersEntityListConfig();

    constructor(
        private userService: UserService,
        private claimsService: ClaimsService,
        private router: Router,
    ) { }

    ngOnInit(): void {

        this.canAddUser = this.claimsService.hasClaim(ClaimTypes.Users, [ClaimValues.FullAccess]);

        this.getUsers();
    }

    getUsers(): void {
        const search = this.query;
        const extrasearchparams: ExtraSearchParams[] = [];

        const searchparams = new SearchParams(
            (search && search.length > 0 ? search : ''),
            (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            entityListModuleConfig.itemsPerPage,
            extrasearchparams);

        this.userService.get(searchparams).subscribe(
            (answer) => {
                this.users = answer.body;
                this.total = +answer.headers.get('X-List-Count');
            },
        );
    }

    search(query: string): void {
        this.query = query;
        this.currentPage = 1;
        this.getUsers();
    }

    userSelected(event: IItemSelectedEvent): void {
        this.router.navigate(['/users', event.entity.Id]);
    }

}
