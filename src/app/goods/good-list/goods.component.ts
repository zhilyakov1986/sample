import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

import { ExtraSearchParams, SearchParams } from '@mt-ng2/common-classes';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';

import { GoodService } from '../good.service';
import { ServiceTypeService } from '../servicetype.service';
import { ServiceDivisionService } from '../../manage/service-division.service';
import { IGood } from '../../model/interfaces/good';
import { entityListModuleConfig } from '../../common/shared.module';
import { ClaimTypes } from '../../model/ClaimTypes';
import { GoodsEntityListConfig } from './goods.entity-list-config';
import { IItemSelectedEvent } from '@mt-ng2/entity-list-module';
import { Router } from '@angular/router';
import { NotificationsService } from '@mt-ng2/notifications-module';

@Component({
    selector: 'app-goods',
    templateUrl: './goods.component.html',
})
export class GoodsComponent implements OnInit {
    goods: IGood[];
    currentPage = 1;
    total: number;
    servicetypes: MtSearchFilterItem[] = [];
    serviceDivisions: MtSearchFilterItem[] = [];
    canAddGood = false;
    includeArchived = false;
    result = 0;
    query: string;

    entityListConfig = new GoodsEntityListConfig(
        this.toggleArchiveStatus.bind(this),
    );

    constructor(
        private notificationsService: NotificationsService,
        private goodService: GoodService,
        private serviceTypeService: ServiceTypeService,
        private claimsService: ClaimsService,
        private serviceDivisionService: ServiceDivisionService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.canAddGood = this.claimsService.hasClaim(ClaimTypes.Goods, [
            ClaimValues.FullAccess,
        ]);
        this.getGoods();

        this.serviceTypeService
            .getAll()
            .subscribe(
                (answer) =>
                    (this.servicetypes = answer.map(
                        (servicetype) =>
                            new MtSearchFilterItem(servicetype, false),
                    )),
            );

        this.serviceDivisionService
            .getAll()
            .subscribe(
                (answer) =>
                    (this.serviceDivisions = answer.map(
                        (serviceDivision) =>
                            new MtSearchFilterItem(serviceDivision, false),
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
        const selectedDivisionServiceIds: number[] = this.getSelectedFilters(
            this.serviceDivisions,
        );

        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams(
                'ServiceTypeIds',
                null,
                selectedServiceTypeIds,
            ),
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
        return _extraSearchParams;
    }

    getGoods(): void {
        const search = this.query;

        const _extraSearchParams: ExtraSearchParams[] = this.buildSearch();

        const searchparams = new SearchParams(
            search && search.length > 0 ? search : '',
            (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            entityListModuleConfig.itemsPerPage,
            _extraSearchParams,
        );

        this.goodService.get(searchparams).subscribe((answer) => {
            this.goods = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    search(query: string): void {
        this.query = query;
        this.currentPage = 1;
        this.getGoods();
    }
    includeArchivedChanged(): void {
        this.currentPage = 1;
        this.getGoods();
    }
    goodSelected(event: IItemSelectedEvent): void {
        this.router.navigate(['/goods', event.entity.Id]);
    }
    toggleArchiveStatus(good: IGood): void {
        good.Archived = !good.Archived;
        this.goodService.update(good).subscribe(
            () => {
                this.success();
                this.getGoods();
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
