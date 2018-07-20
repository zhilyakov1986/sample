import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

import { ExtraSearchParams, SearchParams } from '@mt-ng2/common-classes';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';

import { CustomerLocationService } from '../customerlocation.service';
import { ServiceAreaService } from '../../manage/service-area.service';

import { ICustomerLocation } from '../../model/interfaces/customer-location';
import { entityListModuleConfig } from '../../common/shared.module';
import { ClaimTypes } from '../../model/ClaimTypes';
import { CustomerLocationsEntityListConfig } from './customer-locations.entity-list-config';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { IItemSelectedEvent } from '@mt-ng2/entity-list-module';
import { Router } from '@angular/router';
import { MetaItemListDefinition } from '@mt-ng2/sub-entities-module';

@Component({
    selector: 'app-customer-locations',
    templateUrl: './customer-locations.component.html',
})
export class CustomerLocationsComponent implements OnInit {
    customerLocations: ICustomerLocation[];
    currentPage = 1;
    total: number;
    serviceareas: MtSearchFilterItem[] = [];
    addresses: MtSearchFilterItem[] = [];
    canAddCustomerLocation = false;
    includeArchived = false;
    query: string;
    typefilter: MetaItemListDefinition = null;

    entityListConfig = new CustomerLocationsEntityListConfig(
        this.toggleArchiveStatus.bind(this),
    );

    constructor(
        private notificationsService: NotificationsService,
        private serviceAreaService: ServiceAreaService,
        private customerLocationService: CustomerLocationService,
        private claimsService: ClaimsService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.canAddCustomerLocation = this.claimsService.hasClaim(
            ClaimTypes.Customers,
            [ClaimValues.FullAccess],
        );
        this.getCustomerLocations();

        this.serviceAreaService
            .getAll()
            .subscribe(
                (answer) =>
                    (this.serviceareas = answer.map(
                        (areaService) =>
                            new MtSearchFilterItem(areaService, false),
                    )),
            );
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj
            .filter((item) => item.Selected)
            .map((item) => item.Item.Id);
    }

    private buildSearch(): ExtraSearchParams[] {
        const selectedServiceAreaIds: number[] = this.getSelectedFilters(
            this.serviceareas,
        );

        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams(
                'ServiceAreaIds',
                null,
                selectedServiceAreaIds,
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

        return _extraSearchParams;
    }

    getCustomerLocations(): void {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = this.buildSearch();

        const searchparams = new SearchParams(
            search && search.length > 0 ? search : '',
            (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            entityListModuleConfig.itemsPerPage,
            _extraSearchParams,
        );

        this.customerLocationService.get(searchparams).subscribe((answer) => {
            this.customerLocations = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    search(query: string): void {
        this.query = query;
        this.currentPage = 1;
        this.getCustomerLocations();
    }
    includeArchivedChanged(): void {
        this.currentPage = 1;
        this.getCustomerLocations();
    }
    customerLocationSelected(event: IItemSelectedEvent): void {
        this.router.navigate(['/customerlocations', event.entity.Id]);
    }

    toggleArchiveStatus(customerLocation: ICustomerLocation): void {
        customerLocation.Archived = !customerLocation.Archived;
        this.customerLocationService.update(customerLocation).subscribe(
            () => {
                this.success();
                this.getCustomerLocations(); // TO DO AZ implement error check
            },
            (err) => {
                this.error();
            },
        );
    }

    error(): void {
        this.notificationsService.error('Save Failed');
    }

    success(): void {
        this.notificationsService.success('Saved Successfully');
    }
}
