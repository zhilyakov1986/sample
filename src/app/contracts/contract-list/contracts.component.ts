import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

import { ExtraSearchParams, SearchParams } from '@mt-ng2/common-classes';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';

import { ContractService } from '../contract.service';
import { ContractStatusService } from '../contractstatus.service';
import { ServiceDivisionService } from '../../manage/service-division.service';
import { IContract } from '../../model/interfaces/contract';
import { entityListModuleConfig } from '../../common/shared.module';
import { ClaimTypes } from '../../model/ClaimTypes';
import { ContractsEntityListConfig } from './contracts.entity-list-config';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { IItemSelectedEvent } from '@mt-ng2/entity-list-module';
import { Router } from '@angular/router';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';
import { CustomerLocationService } from '../../customer-locations/customerlocation.service';
import { ICustomerLocation } from '../../model/interfaces/customer-location';
import { CustomerService } from '../../customers/customer.service';
import { UserService } from '../../users/user.service';
import { IUser } from '../../model/interfaces/user';

@Component({
    selector: 'app-contracts',
    templateUrl: './contracts.component.html',
})
export class ContractsComponent implements OnInit {
    contracts: IContract[];
    currentPage = 1;
    total: number;
    statuses: MtSearchFilterItem[] = [];
    servicedivisions: MtSearchFilterItem[] = [];
    canAddContract = false;
    includeArchived = false;
    toggleDialog = false;
    orderDateStart: Date = null;
    orderDateEnd: Date = null;
    customerLocations: ICustomerLocation[];
    query: string;
    cutomerForLocation: string;
    user: IUser;

    entityListConfig = new ContractsEntityListConfig(
        this.toggleArchiveStatus.bind(this),
        this.openCustomerLocationDialog.bind(this),
    );

    constructor(
        private customerService: CustomerService,
        private customerLocationService: CustomerLocationService,
        private notificationsService: NotificationsService,
        private contractService: ContractService,
        private contractStatusService: ContractStatusService,
        private serviceDivisionService: ServiceDivisionService,
        private claimsService: ClaimsService,
        private userService: UserService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.canAddContract = this.claimsService.hasClaim(
            ClaimTypes.Contracts,
            [ClaimValues.FullAccess],
        );
        this.getContracts();

        this.contractStatusService
            .getAll()
            .subscribe(
                (answer) =>
                    (this.statuses = answer.map(
                        (status) => new MtSearchFilterItem(status, false),
                    )),
            );

        this.serviceDivisionService
            .getAll()
            .subscribe(
                (answer) =>
                    (this.servicedivisions = answer.map(
                        (servicedivision) =>
                            new MtSearchFilterItem(servicedivision, false),
                    )),
            );
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj
            .filter((item) => item.Selected)
            .map((item) => item.Item.Id);
    }

    private getDateValueForParams(date: Date): string {
        const year = date.getFullYear();
        let month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        let day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return `${month}-${day}-${year}`;
    }

    private buildSearch(): ExtraSearchParams[] {
        const selectedStatusIds: number[] = this.getSelectedFilters(
            this.statuses,
        );
        const selectedDivisionServiceIds: number[] = this.getSelectedFilters(
            this.servicedivisions,
        );
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams('ContractStatusIds', null, selectedStatusIds),
        );
        _extraSearchParams.push(
            new ExtraSearchParams(
                'ServiceDivisionIds',
                null,
                selectedDivisionServiceIds,
            ),
        );
        if (!this.includeArchived) {
            _extraSearchParams.push(
                new ExtraSearchParams(
                    'archived',
                    this.includeArchived.toString(),
                ),
            );
        }
        if (this.orderDateStart) {
            _extraSearchParams.push(
                new ExtraSearchParams(
                    'OrderDateStart',
                    this.getDateValueForParams(this.orderDateStart),
                ),
            );
        }
        if (this.orderDateEnd) {
            _extraSearchParams.push(
                new ExtraSearchParams(
                    'OrderDateEnd',
                    this.getDateValueForParams(this.orderDateEnd),
                ),
            );
        }
        return _extraSearchParams;
    }
    orderDateSelectionChanged(value: ISearchFilterDaterangeValue): void {
        this.orderDateStart = value.startDate;
        this.orderDateEnd = value.endDate;
        this.getContracts();
    }

    getContracts(): void {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = this.buildSearch();

        const searchparams = new SearchParams(
            search && search.length > 0 ? search : '',
            (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            entityListModuleConfig.itemsPerPage,
            _extraSearchParams,
        );

        this.contractService.get(searchparams).subscribe((answer) => {
            this.contracts = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    search(query: string): void {
        this.query = query;
        this.currentPage = 1;
        this.getContracts();
    }

    includeArchivedChanged(): void {
        this.currentPage = 1;
        this.getContracts();
    }
    contractSelected(event: IItemSelectedEvent): void {
        this.router.navigate(['/contracts', event.entity.Id]);
    }

    toggleArchiveStatus(contract: IContract): void {
        contract.Archived = !contract.Archived;
        this.contractService.update(contract).subscribe(
            () => {
                this.success();
                this.getContracts();
            },
            (err) => {
                this.error();
            },
        );
    }
    openCustomerLocationDialog(contract: IContract): void {
        this.toggleDialog = !this.toggleDialog;
        this.cutomerForLocation = contract.Customer.Name;
        this.customerLocationService
            .getLocationByCustomer(contract.CustomerId)
            .subscribe(
                (answer) => (this.customerLocations = answer),
                (err) =>
                    this.notificationsService.error(
                        'Failed to get locations for customer',
                    ),
            );
    }
    goToLocationName(location: ICustomerLocation): void {
        this.router.navigate([`/customerlocations/${location.Id}`]);
    }

    error(): void {
        this.notificationsService.error('Save Failed');
    }

    success(): void {
        this.notificationsService.success('Saved Successfully');
    }
}
