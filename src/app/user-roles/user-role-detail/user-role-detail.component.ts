import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { IUserRole } from '../../model/interfaces/user-role';
import { UserRoleService } from '../user-role.service';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { CommonFunctionsService } from '@mt-ng2/common-functions';
import { ClaimTypes } from '../../model/ClaimTypes';
import { IClaimType } from '../../model/interfaces/claim-type';

@Component({
    selector: 'app-user-role-detail',
    templateUrl: './user-role-detail.component.html',
})
export class UserRoleDetailComponent implements OnInit, OnDestroy {
    userRole: IUserRole;
    editingComponent: Subject<any> = new Subject();
    canEdit: boolean;
    canAdd: boolean;
    routeSubscription: Subscription;
    claimTypes: IClaimType[] = [];
    constructor(
      private userRoleService: UserRoleService,
      private claimsService: ClaimsService,
      private route: ActivatedRoute,
      private notificationsService: NotificationsService,
      private commonFunctionsService: CommonFunctionsService,
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
        this.canEdit = this.claimsService.hasClaim(ClaimTypes.UserRoles, [ClaimValues.FullAccess]);
        this.canAdd = this.canEdit;
        const id = +this.route.snapshot.paramMap.get('userRoleId');
        if (id > 0) {
            this.getUserRoleById(id);
        } else {
            this.userRole = this.userRoleService.getEmptyUserRole();
        }
        this.getClaimTypes();
    }

    ngOnDestroy(): void {
        this.routeSubscription.unsubscribe();
    }

    getUserRoleById(id: number): void {
        this.userRoleService.getRoleById(id)
            .subscribe((role) => {
                this.userRole = role;
                this.canEdit = this.userRole.IsEditable;
                this.canAdd = this.canEdit;
            });
    }

    deleteRole(): void {
        this.userRoleService.deleteRole(this.userRole.Id)
            .subscribe((answer) => {
                this.router.navigate(['/roles']);
                this.notificationsService.success('Role Deleted');
            }, (error) => {
                this.notificationsService.error('Delete Failed');
            });
    }

    getClaimTypes(): void {
        this.userRoleService.getClaimTypes()
            .subscribe((answer) => {
                this.claimTypes = answer;
            });
    }

    saveClaims(claim): void {
        const existing = this.userRole.UserRoleClaims.find((urc) => urc.ClaimTypeId === claim.ClaimTypeId);
        const index = existing ? this.userRole.UserRoleClaims.indexOf(existing) : this.userRole.UserRoleClaims.length;
        if (claim.ClaimValueId === 0) {
            this.userRole.UserRoleClaims.splice(index, 1);
        } else {
            claim.RoleId = this.userRole.Id;
            this.userRole.UserRoleClaims[index] = claim;
        }
        this.userRoleService.updateClaims(this.userRole.Id, this.userRole.UserRoleClaims)
            .subscribe((answer) => {
                this.notificationsService.success('Saved Succesfully');
                this.getUserRoleById(this.userRole.Id);
            });
    }
}
