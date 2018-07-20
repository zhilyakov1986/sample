import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { Subject, Subscription } from 'rxjs';
import 'rxjs/add/operator/debounceTime';

import { ICustomer } from '../../model/partials/customer';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { CustomerService } from '../customer.service';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { CustomerLocationService } from '../../customer-locations/customerlocation.service';
import { CustomerLocationDynamicControlsPartial } from '../../model/partials/customer-location.form-controls';

import { ClaimTypes } from '../../model/ClaimTypes';
import { ICustomerLocation } from '../../model/interfaces/customer-location';

@Component({
    selector: 'app-customer-detail',
    templateUrl: './customer-detail.component.html',
})
export class CustomerDetailComponent implements OnInit, OnDestroy {
    customer: ICustomer;
    editingComponent: Subject<any> = new Subject();
    canEdit: boolean;
    canAdd: boolean;
    id: number;
    routeSubscription: Subscription;
    customerLocationDynamicForm = new CustomerLocationDynamicControlsPartial()
        .Form;

    customerLocations: ICustomerLocation[];

    constructor(
        private customerLocationService: CustomerLocationService,
        private customerService: CustomerService,
        private claimsService: ClaimsService,
        private route: ActivatedRoute,
        private notificationsService: NotificationsService,
        private router: Router,
    ) {
        this.routeSubscription = router.events
            .filter((event) => event instanceof NavigationEnd)
            .map(() => route)
            .map((route) => {
                while (route.firstChild) {
                    route = route.firstChild;
                }
                return route;
            })
            .filter((route) => route.outlet === 'primary')
            .mergeMap((route) => route.data)
            .subscribe((event) => {
                this.ngOnInit();
            });
    }

    ngOnInit(): void {
        // check claims
        this.canEdit = this.claimsService.hasClaim(ClaimTypes.Customers, [
            ClaimValues.FullAccess,
        ]);
        this.canAdd = this.canEdit;
        // get current id from route
        this.id = +this.route.snapshot.paramMap.get('customerId');

        this.customerLocationService
            .getLocationByCustomer(this.id)
            .subscribe((answer) => (this.customerLocations = answer));
        // try load if id > 0
        if (this.id > 0) {
            this.getCustomerById(this.id);
        } else {
            // set customer to emptyCustomer
            this.customer = this.customerService.getEmptyCustomer();
        }
        this.editingComponent.next('');
    }

    ngOnDestroy(): void {
        this.routeSubscription.unsubscribe();
    }

    getCustomerById(id: number): void {
        this.customerService.getCustomerDetail(id).subscribe((customer) => {
            this.customer = customer;
        });
    }

    savePhones(phoneCollection: any): void {
        this.customerService
            .saveCustomerPhones(this.customer.Id, phoneCollection)
            .subscribe(
                (success) => {
                    this.notificationsService.success(
                        'Phones Saved Successfully',
                    );
                    this.customer.CustomerPhones = phoneCollection.Phones;
                    this.editingComponent.next('');
                },
                (error) => this.notificationsService.error('Save Failed'),
            );
    }
    goToLocationName(location: ICustomerLocation): void {
        this.router.navigate([`/customerlocations/${location.Id}`]);
    }
}
