import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/debounceTime';

import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ExtraSearchParams, SearchParams } from '@mt-ng2/common-classes';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';

import { CustomerService } from '../customer.service';
import { ICustomer } from '../../model/interfaces/customer';
import { CustomerSourceService } from '../customersource.service';
import { CustomerStatusService } from '../customerstatus.service';
import { ClaimTypes } from '../../model/ClaimTypes';
import { CustomersEntityListConfig } from './customers.entity-list-config';
import { IItemSelectedEvent } from '@mt-ng2/entity-list-module';
import { entityListModuleConfig } from '../../common/shared.module';

@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
})
export class CustomersComponent implements OnInit {
    sources: MtSearchFilterItem[] = [];
    statuses: MtSearchFilterItem[] = [];
    customers: ICustomer[];
    total: number;
    currentPage = 1;
    canAddCustomer = false;
    query: string;
    entityListConfig = new CustomersEntityListConfig();

    constructor(
        private customerService: CustomerService,
        private claimsService: ClaimsService,
        private customerStatusService: CustomerStatusService,
        private customerSourcesService: CustomerSourceService,
        private router: Router) { }

    ngOnInit(): void {

        this.canAddCustomer = this.claimsService.hasClaim(ClaimTypes.Customers, [ClaimValues.FullAccess]);

        // get sources
        this.customerSourcesService.getAll()
            .subscribe(
            (answer) => this.sources = answer.map((source) => new MtSearchFilterItem(source, false)),
        );

        // get statuses
        this.customerStatusService.getAll()
            .subscribe(
            (answer) => this.statuses = answer.map((status) => new MtSearchFilterItem(status, false)),
        );

        this.getCustomers();
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj
            .filter((item) => item.Selected)
            .map((item) => item.Item.Id);
    }

    private buildSearch(): ExtraSearchParams[] {
        const selectedSourceIds: number[] = this.getSelectedFilters(this.sources);
        const selectedStatusIds: number[] = this.getSelectedFilters(this.statuses);
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(new ExtraSearchParams('SourceIds', null, selectedSourceIds));
        _extraSearchParams.push(new ExtraSearchParams('StatusIds', null, selectedStatusIds));

        return _extraSearchParams;
    }

    getCustomers(): void {

        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = this.buildSearch();

        const searchparams = new SearchParams(
            (search && search.length > 0 ? search : ''),
            (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            entityListModuleConfig.itemsPerPage,
            _extraSearchParams);

        this.customerService.get(searchparams).subscribe(
            (answer) => {
                this.customers = answer.body;
                this.total = +answer.headers.get('X-List-Count');
            },
        );
    }

    search(query: string): void {
        this.query = query;
        this.currentPage = 1;
        this.getCustomers();
    }

    customerSelected(event: IItemSelectedEvent): void {
        this.router.navigate(['/customers', event.entity.Id]);
    }

}
