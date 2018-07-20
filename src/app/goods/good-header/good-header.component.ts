import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { IGood } from '../../model/interfaces/good';
import { GoodService } from '../good.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-good-header',
  templateUrl: './good-header.component.html',
})
export class GoodHeaderComponent implements OnInit, OnDestroy {
  good: IGood;
  header: string;
  routeSubscription: Subscription;
  basicInfoSubscription: Subscription;

  constructor(
    private goodService: GoodService,
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

      this.basicInfoSubscription = goodService.changeEmitted$.subscribe((good) => {
        this.ngOnInit();
      });
     }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('goodId');
    if (id > 0) {
      this.getGoodById(id);
    } else {
      this.header = 'Add Good';
      this.good = this.goodService.getEmptyGood();
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.basicInfoSubscription.unsubscribe();
  }

  getGoodById(id: number): void {
    this.goodService.getById(id)
      .subscribe((good) => {
        this.good = good;
        this.header = `Good: ${good.Name}`;
      });
  }
}
