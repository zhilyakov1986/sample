import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { Subject, Subscription } from 'rxjs';
import 'rxjs/add/operator/debounceTime';

import { CommonFunctionsService } from '@mt-ng2/common-functions';
import { IUser } from '../../model/interfaces/user';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { UserService } from '../user.service';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { IAddress } from '../../model/interfaces/base';

import { ClaimTypes } from '../../model/ClaimTypes';
import { AuthService } from '@mt-ng2/auth-module';
import { IServiceArea } from '../../model/interfaces/service-area';
import { ServiceAreaService } from '../../manage/service-area.service';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
})
export class UserDetailComponent implements OnInit, OnDestroy {
    user: IUser;
    currentUser;
    editingComponent: Subject<any> = new Subject();
    canEdit: boolean;
    userAddress: IAddress;
    canAdd: boolean;
    routeSubscription: Subscription;
    myProfile: boolean;
    serviceAreas: IServiceArea[];
    constructor(
        private serviceAreaService: ServiceAreaService,
        private userService: UserService,
        private authService: AuthService,
        private claimsService: ClaimsService,
        private route: ActivatedRoute,
        private notificationsService: NotificationsService,
        private commonFunctionsService: CommonFunctionsService,
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
        this.canEdit = this.claimsService.hasClaim(ClaimTypes.Users, [
            ClaimValues.FullAccess,
        ]);
        // get current id from route
        let id = +this.route.snapshot.paramMap.get('userId');
        // check if this is the my-profile path
        if (this.route.snapshot.routeConfig.path === 'my-profile') {
            this.myProfile = true;
            id = this.currentUser = this.authService.currentUser.getValue().Id;
        }
        // try load if id > 0
        if (id > 0) {
            this.getUserById(id);
        } else {
            // set user to emptyUser
            this.user = this.userService.getEmptyUser();
        }

        this.editingComponent.next('');
        this.getServiceAreas();
    }

    ngOnDestroy(): void {
        this.routeSubscription.unsubscribe();
    }
    getServiceAreas(): void {
        this.serviceAreaService.getAll().subscribe((answer) => {
            this.serviceAreas = answer;
        });
    }
    saveServiceAreas(): void {
        console.log('button works');
    }

    getUserById(id: number): void {
        this.userService.getById(id).subscribe((user) => {
            this.user = user;
            this.canEdit =
                this.user.AuthUser && this.user.AuthUser.IsEditable
                    ? true
                    : false;
            this.currentUser = this.authService.currentUser.getValue();
            if (user.Address) {
                this.userAddress = user.Address;
            } else {
                this.userAddress = null;
            }
        });
    }

    saveAddress(address): void {
        this.userService
            .saveAddress(this.user.Id, address)
            .subscribe((answer) => {
                address.Id = answer;
                this.notificationsService.success('Address Saved Successfully');
                this.user.Address = address;
                this.userAddress = address;
            });
    }

    deleteAddress(address): void {
        this.userService.deleteAddress(this.user.Id).subscribe((answer) => {
            this.notificationsService.success('Address Deleted Successfully');
            this.userAddress = null;
            this.user.Address = null;
        });
    }

    savePhones(phoneCollection: any): void {
        this.userService
            .savePhones(this.user.Id, phoneCollection)
            .subscribe((answer) => {
                this.notificationsService.success('Phones Saved Successfully');
                this.user.UserPhones = phoneCollection.Phones;
                this.editingComponent.next('');
            });
    }

    updateVersion(version): void {
        this.user.Version = version;
    }
}
