import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { IUser } from '../../model/interfaces/user';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
})
export class UserHeaderComponent implements OnInit, OnDestroy {
  user: IUser;
  header: string;
  routeSubscription: Subscription;
  basicInfoSubscription: Subscription;

  constructor(
    private userService: UserService,
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

      this.basicInfoSubscription = userService.changeEmitted$.subscribe((user) => {
          this.ngOnInit();
      });
     }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('userId');
    if (id > 0) {
      this.getUserById(id);
    } else {
      this.header = 'Add User';
      this.user = this.userService.getEmptyUser();
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.basicInfoSubscription.unsubscribe();
  }

  getUserById(id: number): void {
    this.userService.getById(id)
      .subscribe((user) => {
        this.user = user;
        this.header = `User: ${this.user.FirstName} ${this.user.LastName}`;
      });
  }
}
