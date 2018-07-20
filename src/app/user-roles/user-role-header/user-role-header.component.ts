import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { UserRoleService } from '../user-role.service';
import { Subscription } from 'rxjs/Subscription';
import { IUserRole } from '../../model/interfaces/user-role';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-role-header.component.html',
})
export class UserRoleHeaderComponent implements OnInit, OnDestroy {
  userRole: IUserRole;
  header: string;
  routeSubscription: Subscription;
  basicInfoSubscription: Subscription;

  constructor(
    private userRoleService: UserRoleService,
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

      this.basicInfoSubscription = userRoleService.changeEmitted$.subscribe((role) => {
          this.ngOnInit();
      });
     }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('userRoleId');
    if (id > 0) {
      this.getUserById(id);
    } else {
      this.header = 'Add User Role';
      this.userRole = this.userRoleService.getEmptyUserRole();
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.basicInfoSubscription.unsubscribe();
  }

  getUserById(id: number): void {
    this.userRoleService.getRoleById(id)
      .subscribe((role) => {
        this.userRole = role;
        this.header = `User Role: ${this.userRole.Name}`;
      });
  }
}
