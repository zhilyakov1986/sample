import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { DynamicField, InputTypes } from '@mt-ng2/dynamic-form';

import { CommonFunctionsService } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ContractService } from '../contract.service';

import { IContract } from '../../model/interfaces/contract';
import { ContractDynamicConfig } from '../contract.dynamic-config';
import { ICustomer } from '../../model/interfaces/customer';
import { CustomerService } from '../../customers/customer.service';
import { IContractStatus } from '../../model/interfaces/contract-status';
import { ContractStatusService } from '../contractstatus.service';
import { IServiceDivision } from '../../model/interfaces/service-division';
import { IServiceArea } from '../../model/interfaces/service-area';
import { ServiceDivisionService } from '../../manage/service-division.service';
import { ServiceAreaService } from '../../manage/service-area.service';
import { ServiceAreaDynamicControlsPartial } from '../../model/partials/service-area.form-controls';
import { IMetaItem } from '../../model/interfaces/base';
import { UserService } from '../../users/user.service';
import { IUser } from '../../model/interfaces/user';
import { AuthService } from '@mt-ng2/auth-module';

@Component({
    selector: 'app-contract-basic-info',
    templateUrl: './contract-basic-info.component.html',
})
export class ContractBasicInfoComponent implements OnInit {
    @Input() contract: IContract;
    @Input() canEdit: boolean;
    customers?: IMetaItem[];
    users?: IMetaItem[];
    statuses?: IContractStatus[];
    servicedivisions?: IServiceDivision[];
    serviceAreas?: IServiceArea[];

    isEditing: boolean;
    isHovered: boolean;
    config: any = {};
    contractForm: any;
    formFactory: ContractDynamicConfig<IContract>;
    doubleClickIsDisabled = false;
    totalOrders: number;

    constructor(
        private serviceAreaService: ServiceAreaService,
        private customerService: CustomerService,
        private contractStatusService: ContractStatusService,
        private serviceDivisionService: ServiceDivisionService,
        private contractService: ContractService,
        private notificationsService: NotificationsService,
        private router: Router,
        private commonFunctionsService: CommonFunctionsService,
        private userService: UserService,
        private authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.isEditing = false;
        this.config = { formObject: [], viewOnly: [] };
        Observable.forkJoin(
            this.getUsers(),
            this.getCustomers(),
            this.getStatuses(),
            this.getServicedivisions(),
            this.getServiceAreas(),
        ).subscribe((answer) => this.setConfig());
    }

    setConfig(): void {
        this.formFactory = new ContractDynamicConfig<IContract>(
            this.contract,
            this.customers,
            this.statuses,
            this.servicedivisions,
            null,
            this.serviceAreas,
            this.users,
        );

        if (this.contract.Id === 0) {
            // new contract
            this.isEditing = true;
            this.config = this.formFactory.getForCreate();
        } else {
            // existing contract
            this.config = this.formFactory.getForUpdate();
        }
    }

    getServiceAreas(): Observable<IServiceArea[]> {
        return this.serviceAreaService.getAll().do((answer) => {
            this.serviceAreas = answer;
        });
    }

    getCustomers(): Observable<IMetaItem[]> {
        return this.customerService.getSimplifiedCustomers().do((answer) => {
            this.customers = answer;
        });
    }
    getUsers(): Observable<IMetaItem[]> {
        return this.userService.getSimplifiedUsers().do((answer) => {
            this.users = answer;
        });
    }
    getStatuses(): Observable<IContractStatus[]> {
        return this.contractStatusService.getAll().do((answer) => {
            this.statuses = answer;
        });
    }
    getServicedivisions(): Observable<IServiceDivision[]> {
        return this.serviceDivisionService.getAll().do((answer) => {
            this.servicedivisions = answer;
        });
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancelClick(): void {
        if (this.contract.Id === 0) {
            this.router.navigate(['/contracts']);
        } else {
            this.isEditing = false;
        }
    }

    formSubmitted(form): void {
        if (form.valid) {
            this.formFactory.assignFormValues(
                this.contract,
                form.value.Contract,
            );
            if (!this.contract.Id || this.contract.Id === 0) {
                let currentUser = this.authService.currentUser.getValue();
                if (!this.contract.UserId) {
                    this.contract.UserId = currentUser.Id;
                }

                this.contractService
                    .create(this.contract)

                    .finally(() => (this.doubleClickIsDisabled = false))
                    .subscribe((answer) => {
                        this.router.navigate(['/contracts/' + answer]);
                        this.success();
                        this.contractService.emitChange(this.contract);
                    });
            } else {
                // handle existing contract save
                this.contractService
                    .update(this.contract)
                    .finally(() => (this.doubleClickIsDisabled = false))
                    .subscribe(() => {
                        (this.isEditing = false),
                            this.success(),
                            this.contractService.emitChange(this.contract),
                            this.setConfig();
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
