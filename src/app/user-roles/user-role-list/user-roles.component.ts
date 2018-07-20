import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IUserRole } from '../../model/interfaces/user-role';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { UserRoleService } from '../user-role.service';
import { ClaimTypes } from '../../model/ClaimTypes';
import { ExtraSearchParams, SearchParams } from '@mt-ng2/common-classes';
import { entityListModuleConfig } from '../../common/shared.module';

@Component({
    selector: 'app-user-roles',
    templateUrl: './user-roles.component.html',
})
export class UserRolesComponent implements OnInit {
    searchControl = new FormControl();
    userRoles: IUserRole[];
    currentPage = 1;
    total: number;
    canAddRole = false;
    itemsPerPage = entityListModuleConfig.itemsPerPage;

    constructor(
        private userRoleService: UserRoleService,
        private claimService: ClaimsService,
    ) {}

    ngOnInit(): void {
        this.searchControl
            .valueChanges
            .debounceTime(300)
            .subscribe((value) => this.getUserRoles());

        this.canAddRole = this.claimService.hasClaim(ClaimTypes.UserRoles, [ClaimValues.FullAccess]);
        this.getUserRoles();
    }

    getUserRoles(): void {
        const search = this.searchControl.value;
        const extrasearchparams: ExtraSearchParams[] = [];

        const searchparams = new SearchParams(
            (search && search.length > 0 ? search : ''),
            (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            entityListModuleConfig.itemsPerPage,
            extrasearchparams);
        this.userRoleService.get(searchparams).subscribe(
            (answer) => {
                this.userRoles = answer.body;
                this.total = +answer.headers.get('X-List-Count');
            },
        );
    }

    clearSearch(): void {
        this.searchControl.setValue('');
    }

    noRoles(): boolean {
        return !this.userRoles || this.userRoles.length === 0;
    }

    pagingNeeded(): boolean {
        return this.total > this.itemsPerPage;
    }
}
