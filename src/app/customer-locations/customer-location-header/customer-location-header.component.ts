import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { ICustomerLocation } from '../../model/interfaces/customer-location';
import { CustomerLocationService } from '../customerlocation.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-customer-location-header',
  templateUrl: './customer-location-header.component.html',
})
export class CustomerLocationHeaderComponent implements OnInit, OnDestroy {
  customerLocation: ICustomerLocation;
  header: string;
  routeSubscription: Subscription;
  basicInfoSubscription: Subscription;

  constructor(
    private customerLocationService: CustomerLocationService,
    private route: ActivatedRoute,
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

      this.basicInfoSubscription = customerLocationService.changeEmitted$.subscribe((customerLocation) => {
        this.ngOnInit();
      });
     }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('customerLocationId');
    if (id > 0) {
      this.getCustomerLocationById(id);
    } else {
      this.header = 'Add Customer Location';
      this.customerLocation = this.customerLocationService.getEmptyCustomerLocation();
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.basicInfoSubscription.unsubscribe();
  }

  getCustomerLocationById(id: number): void {
    this.customerLocationService.getById(id)
      .subscribe((customerLocation) => {
        this.customerLocation = customerLocation;
        this.header = `Customer Location `;
      });
  }
}
