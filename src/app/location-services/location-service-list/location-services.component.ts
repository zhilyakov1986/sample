import {
    Component,
    OnInit,
    ViewContainerRef,
    ComponentFactoryResolver,
    ComponentRef,
} from '@angular/core';
import 'rxjs/add/operator/debounceTime';

import { ExtraSearchParams, SearchParams } from '@mt-ng2/common-classes';
import { SwalComponent, SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { LocationServiceService } from '../locationservice.service';
import { ILocationService } from '../../model/interfaces/location-service';
import { entityListModuleConfig } from '../../common/shared.module';
import { LocationServicesEntityListConfig } from './location-services.entity-list-config';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { IItemSelectedEvent } from '@mt-ng2/entity-list-module';
import { ServiceTypeService } from '../../goods/servicetype.service';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-location-services',
    styles: [
        `
            .red {
                color: red;
            }
        `,
    ],
    templateUrl: './location-services.component.html',
})
export class LocationServicesComponent implements OnInit {
    locationServices: ILocationService[];
    calculatedTax: [number, number];
    calculatedTotal: [number, number];
    locationQuery: string;
    cityQuery: string;
    stateQuery: string;
    zipQuery: string;
    serviceQuery: string;
    currentPage = 1;
    total: number;
    includeArchived = false;
    selectedLocationTotal = 0;
    selectedLocationName: string;
    LocationSelected = false;
    selectedLocationService: ILocationService;
    servicetypes: MtSearchFilterItem[] = [];
    taxPerService: string;
    totalLineItem: string;
    swalRef: ComponentRef<SwalComponent>;
    swalInstance: SwalComponent;

    entityListConfig = new LocationServicesEntityListConfig(
        this.showShortDescription.bind(this),
        this.showLongDescription.bind(this),
        this.getTaxPerService.bind(this),
        this.getTotalLineItem.bind(this),
    );

    constructor(
        private resolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef,
        private locationServicesService: LocationServiceService,
        private notificationsService: NotificationsService,
        private serviceTypeService: ServiceTypeService,
    ) {}

    ngOnInit(): void {
        // Pop-up dependency--------------------------------------------------
        const factory = this.resolver.resolveComponentFactory(SwalComponent);
        this.swalRef = this.viewContainerRef.createComponent(factory);
        this.swalInstance = this.swalRef.instance;
        // -------------------------------------------------------------------

        Observable.forkJoin(this.getAllTaxes(), this.getAllTotals()).subscribe(
            () => this.getLocationServices(),
        );

        this.serviceTypeService
            .getAll()
            .subscribe(
                (answer) =>
                    (this.servicetypes = answer.map(
                        (servicetype) =>
                            new MtSearchFilterItem(servicetype, false),
                    )),
            );
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj
            .filter((item) => item.Selected)
            .map((item) => item.Item.Id);
    }

    private buildSearch(): ExtraSearchParams[] {
        const selectedServiceTypeIds: number[] = this.getSelectedFilters(
            this.servicetypes,
        );
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams(
                'ServiceTypeIds',
                null,
                selectedServiceTypeIds,
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
        if (this.serviceQuery) {
            _extraSearchParams.push(
                new ExtraSearchParams('services', this.serviceQuery),
            );
        }
        if (this.cityQuery) {
            _extraSearchParams.push(
                new ExtraSearchParams('city', this.cityQuery),
            );
        }
        if (this.stateQuery) {
            _extraSearchParams.push(
                new ExtraSearchParams('state', this.stateQuery),
            );
        }
        if (this.zipQuery) {
            _extraSearchParams.push(
                new ExtraSearchParams('zip', this.zipQuery),
            );
        }
        return _extraSearchParams;
    }

    searchGood(query: string): void {
        this.serviceQuery = query;
        this.currentPage = 1;
        this.getLocationServices();
    }

    includeArchivedChanged(): void {
        this.currentPage = 1;
        this.getLocationServices();
    }

    getLocationServices(): void {
        const locationSearch = this.locationQuery;
        const _extraSearchParams: ExtraSearchParams[] = this.buildSearch();
        const searchparams = new SearchParams(
            locationSearch && locationSearch.length > 0 ? locationSearch : '',
            (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            entityListModuleConfig.itemsPerPage,
            _extraSearchParams,
        );

        this.locationServicesService.get(searchparams).subscribe((answer) => {
            this.locationServices = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    searchLocation(query: string): void {
        this.locationQuery = query;
        this.currentPage = 1;
        this.getLocationServices();
    }
    searchCity(query: string): void {
        this.cityQuery = query;
        this.currentPage = 1;
        this.getLocationServices();
    }
    searchState(query: string): void {
        this.stateQuery = query;
        this.currentPage = 1;
        this.getLocationServices();
    }
    searchZip(query: string): void {
        this.zipQuery = query;
        this.currentPage = 1;
        this.getLocationServices();
    }

    toggleArchiveStatus(): void {
        this.locationServicesService
            .toggleArchiveForLocation(
                this.selectedLocationService.CustomerLocationId,
            )
            .subscribe(() => {
                this.notificationsService.success('Updated Archive Status');
                this.getLocationServices();
            });
    }
    locationServiceSelected(event: IItemSelectedEvent): void {
        this.selectedLocationService = event.entity;
        this.LocationSelected = true;
        let customerLocationId = event.entity.CustomerLocationId;
        this.selectedLocationName = event.entity.CustomerLocation.Name;
        this.locationServicesService
            .getTotalForLocation(customerLocationId)
            .subscribe((success) => {
                this.selectedLocationTotal = success;
            });
    }

    showShortDescription(locationservice: ILocationService): void {
        this.swalInstance.options = {
            text: locationservice.ShortDescription,
            title: locationservice.Good.Name,
        };
        this.swalInstance.show();
    }
    showLongDescription(locationservice: ILocationService): void {
        this.swalInstance.options = {
            text: locationservice.LongDescription,
            title: locationservice.Good.Name,
        };
        this.swalInstance.show();
    }

    getAllTaxes(): Observable<any> {
        return this.locationServicesService.getAllTaxes().do((answer) => {
            this.calculatedTax = answer;
        });
    }
    getAllTotals(): Observable<any> {
        return this.locationServicesService.getAllTotals().do((answer) => {
            this.calculatedTotal = answer;
        });
    }

    getTaxPerService(locationService: ILocationService): string {
        this.taxPerService = this.calculatedTax[locationService.Id].toFixed(2);
        return this.taxPerService;
    }

    getTotalLineItem(locationService: ILocationService): string {
        this.totalLineItem = this.calculatedTotal[locationService.Id].toFixed(
            2,
        );
        return this.totalLineItem;
    }

    error(): void {
        this.notificationsService.error('Save Failed');
    }

    success(): void {
        this.notificationsService.success('Saved Successfully');
    }
}
