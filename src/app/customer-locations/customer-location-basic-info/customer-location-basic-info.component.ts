import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { CommonFunctionsService } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { CustomerLocationService } from '../customerlocation.service';
import { ServiceAreaService } from '../../manage/service-area.service';
import { CustomerService } from '../../customers/customer.service';

import { CustomerLocationDynamicConfig } from '../customer-location.dynamic-config';

import { IServiceArea } from '../../model/interfaces/service-area';
import { ICustomerLocation } from '../../model/interfaces/customer-location';
import { ICustomer } from '../../model/interfaces/customer';
import { IMetaItem } from '../../model/interfaces/base';

@Component({
    selector: 'app-customer-location-basic-info',
    templateUrl: './customer-location-basic-info.component.html',
})
export class CustomerLocationBasicInfoComponent implements OnInit {
    @Input() customerLocation: ICustomerLocation;
    @Input() canEdit: boolean;

    serviceareas?: IServiceArea[];
    simpleCustomer?: IMetaItem[];

    isEditing: boolean;
    isHovered: boolean;
    config: any = {};
    customerLocationForm: any;
    formFactory: CustomerLocationDynamicConfig<ICustomerLocation>;
    doubleClickIsDisabled = false;

    constructor(
        private customerLocationService: CustomerLocationService,
        private serviceAreaService: ServiceAreaService,
        private customerService: CustomerService,
        public notificationsService: NotificationsService,
        public router: Router,
        private commonFunctionsService: CommonFunctionsService,
    ) {}

    ngOnInit(): void {
        this.isEditing = false;
        this.config = { formObject: [], viewOnly: [] };
        Observable.forkJoin(this.getServiceareas(), this.getCustomers()).subscribe((answer) =>
            this.setConfig(),
        );
    }

    setConfig(): void {
        this.formFactory = new CustomerLocationDynamicConfig<ICustomerLocation>(
            this.customerLocation,
            this.serviceareas,
            this.simpleCustomer,
        );
        if (this.customerLocation.Id === 0) {
            // new customerLocation
            this.isEditing = true;
            this.config = this.formFactory.getForCreate();
        } else {
            // existing customerLocation
            this.config = this.formFactory.getForUpdate();
        }
    }
    getCustomers(): Observable<IMetaItem[]> {
        return this.customerService.getSimplifiedCustomers().do((answer) => {
            this.simpleCustomer = answer;
        });

    }

    getServiceareas(): Observable<IServiceArea[]> {
        return this.serviceAreaService.getAll().do((answer) => {
            this.serviceareas = answer;
        });
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }
    cancelClick(): void {
        if (this.customerLocation.Id === 0) {
            this.router.navigate(['/customerlocations']);
        } else {
            this.isEditing = false;
        }
    }
    formSubmitted(form): void {
        if (form.valid) {
            this.formFactory.assignFormValues(
                this.customerLocation,
                form.value.CustomerLocation,
            );
            if (!this.customerLocation.Id || this.customerLocation.Id === 0) {
                this.customerLocationService
                    .create(this.customerLocation)
                    .finally(() => (this.doubleClickIsDisabled = false))
                    .subscribe((answer) => {
                        this.router.navigate(['/customerlocations/' + answer]);
                        this.success();
                        this.customerLocationService.emitChange(
                            this.customerLocation,
                        );
                    });
            } else {
                // handle existing customerLocation save
                this.customerLocationService
                    .update(this.customerLocation)
                    .finally(() => (this.doubleClickIsDisabled = false))
                    .subscribe(() => {
                            ((this.isEditing = false),
                              this.success(),
                              this.customerLocationService.emitChange(
                                  this.customerLocation,
                              ),
                              this.setConfig());

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
