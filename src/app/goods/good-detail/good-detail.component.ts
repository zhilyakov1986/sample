import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject, Subscription } from 'rxjs';

import { IGood } from '../../model/interfaces/good';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { GoodService } from '../good.service';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';

import { ClaimTypes } from '../../model/ClaimTypes';

@Component({
  selector: 'app-good-detail',
  templateUrl: './good-detail.component.html',
})
export class GoodDetailComponent implements OnInit, OnDestroy {
  good: IGood;
  editingComponent: Subject<any> = new Subject();
  canEdit: boolean;
  canAdd: boolean;
  id: number;
  routeSubscription: Subscription;

  constructor(
    private goodService: GoodService,
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
    this.canEdit = this.claimsService.hasClaim(ClaimTypes.Goods, [ClaimValues.FullAccess]);
    this.canAdd = this.canEdit;
    // get current id from route
    this.id = +this.route.snapshot.paramMap.get('goodId');
    // try load if id > 0
    if (this.id > 0) {
      this.getGoodById(this.id);
    } else {
      // set good to emptyGood
      this.good = this.goodService.getEmptyGood();
    }
    this.editingComponent.next('');
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  getGoodById(id: number): void {
    this.goodService.getById(id)
      .subscribe((good) => {
        this.good = good;
      });
  }
}
