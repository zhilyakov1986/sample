import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { CommonFunctionsService } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { ServiceTypeService } from '../servicetype.service';
import { ServiceDivisionService } from '../../manage/service-division.service';
import { UnitTypeService } from '../../manage/unit-type.service';
import { GoodService } from '../good.service';

import { GoodDynamicConfig } from '../good.dynamic-config';

import { IGood } from '../../model/interfaces/good';
import { IServiceType } from '../../model/interfaces/service-type';
import { IServiceDivision } from '../../model/interfaces/service-division';
import { IUnitType } from '../../model/interfaces/unit-type';

@Component({
    selector: 'app-good-basic-info',
    templateUrl: './good-basic-info.component.html',
})
export class GoodBasicInfoComponent implements OnInit {
    @Input() good: IGood;
    @Input() canEdit: boolean;
    servicetypes?: IServiceType[];
    servicedivision?: IServiceDivision[];
    serviceunit?: IUnitType[];

    isEditing: boolean;
    isHovered: boolean;
    config: any = {};
    goodForm: any;
    formFactory: GoodDynamicConfig<IGood>;
    doubleClickIsDisabled = false;

    constructor(
        private serviceTypeService: ServiceTypeService,
        private serviceDivisionService: ServiceDivisionService,
        private goodService: GoodService,
        private serviceUnitType: UnitTypeService,
        private notificationsService: NotificationsService,
        private router: Router,
        private commonFunctionsService: CommonFunctionsService,
    ) {}

    ngOnInit(): void {
        this.isEditing = false;
        this.config = { formObject: [], viewOnly: [] };
        Observable.forkJoin(
            this.getServicetypes(),
            this.getServiceDivision(),
            this.getServiceUnitType(),
        ).subscribe((answer) => this.setConfig());
    }

    setConfig(): void {
        this.formFactory = new GoodDynamicConfig<IGood>(
            this.good,
            this.servicetypes,
            this.servicedivision,
            this.serviceunit,
        );
        if (this.good.Id === 0) {
            // new good
            this.isEditing = true;
            this.config = this.formFactory.getForCreate();
        } else {
            // existing good
            this.config = this.formFactory.getForUpdate();
        }
    }

    getServicetypes(): Observable<IServiceType[]> {
        return this.serviceTypeService.getAll().do((answer) => {
            this.servicetypes = answer;
        });
    }
    getServiceDivision(): Observable<IServiceType[]> {
        return this.serviceDivisionService.getAll().do((answer) => {
            this.servicedivision = answer;
        });
    }
    getServiceUnitType(): Observable<IServiceType[]> {
        return this.serviceUnitType.getAll().do((answer) => {
            this.serviceunit = answer;
        });
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancelClick(): void {
        if (this.good.Id === 0) {
            this.router.navigate(['/goods']);
        } else {
            this.isEditing = false;
        }
    }

    formSubmitted(form): void {
        if (form.valid) {
            this.formFactory.assignFormValues(this.good, form.value.Good);
            if (!this.good.Id || this.good.Id === 0) {
                // handle new good save
                this.goodService
                    .create(this.good)
                    .finally(() => (this.doubleClickIsDisabled = false))
                    .subscribe((answer) => {
                        this.router.navigate(['/goods/' + answer]);
                        this.success();
                        this.goodService.emitChange(this.good);
                    });
            } else {
                // handle existing good save
                this.goodService
                    .updateVersion(this.good)
                    .finally(() => (this.doubleClickIsDisabled = false))
                    .subscribe((answer) => {
                        answer
                            ? ((this.good.Version = answer),
                              (this.isEditing = false),
                              this.success(),
                              this.goodService.emitChange(this.good),
                              this.setConfig())
                            : this.error();
                    });
            }
        } else {
            this.commonFunctionsService.markAllFormFieldsAsTouched(form);
            this.error();
            setTimeout(() => {
                this.doubleClickIsDisabled = false;
            });
        }
    }

    error(): void {
        this.notificationsService.error('Save Failed');
    }

    success(): void {
        this.notificationsService.success('Saved Successfully');
    }
}
