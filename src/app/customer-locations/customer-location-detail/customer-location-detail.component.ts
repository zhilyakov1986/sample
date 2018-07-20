import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject, Subscription } from 'rxjs';

import { ICustomerLocation } from '../../model/interfaces/customer-location';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { CustomerLocationService } from '../customerlocation.service';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { IAddress } from '../../model/interfaces/base';

import { ClaimTypes } from '../../model/ClaimTypes';

@Component({
  selector: 'app-customer-location-detail',
  templateUrl: './customer-location-detail.component.html',
})
export class CustomerLocationDetailComponent implements OnInit, OnDestroy {
  customerLocation: ICustomerLocation;
  customerLocationAddress: IAddress;
  editingComponent: Subject<any> = new Subject();
  canEdit: boolean;
  canAdd: boolean;
  id: number;
  routeSubscription: Subscription;

  constructor(
    private customerLocationService: CustomerLocationService,
    private claimsService: ClaimsService,
    private route: ActivatedRoute,
    private notificationsService: NotificationsService,
    private router: Router) {
      this.routeSubscription = router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => route)
      .map((route) => {
        while (route.firstChild) {route = route.firstChild; }
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
    this.canEdit = this.claimsService.hasClaim(ClaimTypes.Customers, [ClaimValues.FullAccess]);
    this.canAdd = this.canEdit;
    // get current id from route
    this.id = +this.route.snapshot.paramMap.get('customerLocationId');
    // try load if id > 0
    if (this.id > 0) {
      this.getCustomerLocationById(this.id);
    } else {
      // set customerLocation to emptyCustomerLocation
      this.customerLocation = this.customerLocationService.getEmptyCustomerLocation();
    }
    this.editingComponent.next('');
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  getCustomerLocationById(id: number): void {
    this.customerLocationService.getById(id)
      .subscribe((customerLocation) => {
        this.customerLocation = customerLocation;
        if (customerLocation.Address) {
          this.customerLocationAddress = customerLocation.Address;
        } else {
          this.customerLocationAddress = null;
        }
      });
  }
  saveAddress(address): void {
    this.customerLocationService.saveAddress(this.customerLocation.Id, address)
      .subscribe((answer) => {
        address.Id = answer;
        this.notificationsService.success('Address Saved Successfully');
        this.customerLocation.Address = address;
        this.customerLocationAddress = address;
      });
  }

  deleteAddress(address): void {
    this.customerLocationService.deleteAddress(this.customerLocation.Id)
      .subscribe((answer) => {
        this.notificationsService.success('Address Deleted Successfully');
        this.customerLocationAddress = null;
        this.customerLocation.Address = null;
      });
  }

}
