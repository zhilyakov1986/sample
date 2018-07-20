import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { ICustomer } from '../../model/interfaces/customer';
import { CustomerService } from '../customer.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-customer-header',
  templateUrl: './customer-header.component.html',
})

export class CustomerHeaderComponent implements OnInit, OnDestroy {
  customer: ICustomer;
  header: string;
  routeSubscription: Subscription;
  basicInfoSubscription: Subscription;

  constructor(
    private customerService: CustomerService,
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

      this.basicInfoSubscription = customerService.changeEmitted$.subscribe((customer) => {
          this.ngOnInit();
      });
     }

  ngOnInit(): void {
    // get current id from route
    const id = +this.route.snapshot.paramMap.get('customerId');
    // try load if id > 0
    if (id > 0) {
      this.getCustomerById(id);
    } else {
      // set customer to emptyCustomer
      this.header = 'Add Customer';
      this.customer = this.customerService.getEmptyCustomer();
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.basicInfoSubscription.unsubscribe();
  }

  getCustomerById(id: number): void {
    this.customerService.getById(id)
      .subscribe((customer) => {
        this.customer = customer;
        this.header = `Customer: ${customer.Name}`;
      });
  }

}
