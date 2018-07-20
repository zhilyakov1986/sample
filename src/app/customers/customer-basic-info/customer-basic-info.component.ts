
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { CommonFunctionsService } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { CustomerService } from '../customer.service';

import { ICustomer } from '../../model/interfaces/customer';
import { ICustomerSource } from '../../model/interfaces/customer-source';
import { ICustomerStatus } from '../../model/interfaces/customer-status';
import { CustomerDynamicConfig } from '../customer.dynamic-config';
import { CustomerSourceService } from '../customersource.service';
import { CustomerStatusService } from '../customerstatus.service';

@Component({
  selector: 'app-customer-basic-info',
  templateUrl: './customer-basic-info.component.html',
})
export class CustomerBasicInfoComponent implements OnInit {
  @Input() customer: ICustomer;
  @Input() canEdit: boolean;
  sources: ICustomerSource[];
  statuses: ICustomerStatus[];
  isEditing: boolean;
  isHovered: boolean;
  config: any = {};
  customerForm: any;
  formFactory: CustomerDynamicConfig<ICustomer>;
  doubleClickIsDisabled = false;

  constructor(
    private customerService: CustomerService,
    private notificationsService: NotificationsService,
    private router: Router,
    private commonFunctionsService: CommonFunctionsService,
    private customerSourceService: CustomerSourceService,
    private customerStatusService: CustomerStatusService) { }

  ngOnInit(): void {
    this.isEditing = false;
    this.config = { formObject: [], viewOnly: [] };
    Observable.forkJoin(this.getSources(), this.getStatuses())
      .subscribe((answer) => this.setConfig());
  }

  setConfig(): void {
    this.formFactory = new CustomerDynamicConfig<ICustomer>(this.customer, this.sources, this.statuses);
    if (this.customer.Id === 0) {
      // new customer
      this.isEditing = true;
      this.config = this.formFactory.getForCreate();
    } else {
      // existing customer
      this.config = this.formFactory.getForUpdate();
    }
  }

  getSources(): Observable<ICustomerSource[]> {
    return this.customerSourceService.getAll().do((answer) => {
      this.sources = answer;
    });
  }

  getStatuses(): Observable<ICustomerStatus[]> {
    return this.customerStatusService.getAll().do((answer) => {
      this.statuses = answer;
    });
  }

  edit(): void {
    if (this.canEdit) {
      this.isEditing = true;
    }
  }

  cancelClick(): void {
    if (this.customer.Id === 0) {
      this.router.navigate(['/customers']);
    } else {
      this.isEditing = false;
    }
  }

  formSubmitted(form): void {
    if (form.valid) {
      this.formFactory.assignFormValues(this.customer, form.value.Customer);
      if (!this.customer.Id || this.customer.Id === 0) {
        // handle new customer save
        this.customerService.create(this.customer)
          .finally(() => this.doubleClickIsDisabled = false)
          .subscribe((answer) => {
            this.router.navigate(['/customers/' + answer]);
            this.success();
            this.customerService.emitChange(this.customer);
          });
      } else {
        // handle existing customer save
        this.customerService.updateVersion(this.customer)
          .finally(() => this.doubleClickIsDisabled = false)
          .subscribe((answer) => {
            answer ? (
              (this.customer.Version = answer),
              (this.isEditing = false),
              this.success(),
              this.customerService.emitChange(this.customer),
              this.setConfig())
              : this.error();
          });
      }
    } else {
      this.commonFunctionsService.markAllFormFieldsAsTouched(form);
      this.error();
      setTimeout( () => {
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
