import { OnInit, Component } from '@angular/core';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { ICustomerSource } from '../../model/interfaces/customer-source';
import { CustomerSourceService } from '../customersource.service';
import { CustomerSourceDynamicControls } from '../../model/form-controls/customer-source.form-controls';

@Component({
    selector: 'app-customer-settings',
    templateUrl: './customer-settings.component.html',
})
export class CustomerSettingsComponent implements OnInit {

    customerSources: ICustomerSource[] = [];

    customerSourceDynamicForm = new CustomerSourceDynamicControls(null).Form;

    constructor(
        private customerSourceService: CustomerSourceService,
        private notificationsService: NotificationsService,
    ) { }

    ngOnInit(): void {
        this.getCustomerSources();
    }

    getCustomerSources(): void {
        this.customerSourceService.getAll()
            .subscribe((answer) => {
                this.customerSources = answer;
            });
    }

    saveCustomerSources(form: any): void {
        if (form.valid) {
            this.customerSourceService.updateItems(form.value.CustomerSources)
                .subscribe((answer) => {
                    this.notificationsService.success('Customer Sources Saved Successfully');
                    this.getCustomerSources();
                }, (error) => {
                    if (error.error && error.error.ModelState && error.error.ModelState.Service) {
                        this.notificationsService.error(error.error.ModelState.Service[0]);
                    }
                    this.customerSources = [];
                    this.getCustomerSources();
                });
        } else {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error('Save Failed');
        }
    }

}
