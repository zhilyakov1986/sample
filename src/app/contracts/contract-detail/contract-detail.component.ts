import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject, Subscription } from 'rxjs';

import { IContract } from '../../model/interfaces/contract';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ContractService } from '../contract.service';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';

import { ClaimTypes } from '../../model/ClaimTypes';

@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
})
export class ContractDetailComponent implements OnInit, OnDestroy {
  contract: IContract;
  editingComponent: Subject<any> = new Subject();
  canEdit: boolean;
  canAdd: boolean;
  id: number;
  routeSubscription: Subscription;

  constructor(
    private contractService: ContractService,
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
    this.canEdit = this.claimsService.hasClaim(ClaimTypes.Contracts, [ClaimValues.FullAccess]);
    this.canAdd = this.canEdit;
    // get current id from route
    this.id = +this.route.snapshot.paramMap.get('contractId');
    // try load if id > 0
    if (this.id > 0) {
      this.getContractById(this.id);
    } else {
      // set contract to emptyContract
      this.contract = this.contractService.getEmptyContract();
    }
    this.editingComponent.next('');
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  getContractById(id: number): void {
    this.contractService.getById(id)
      .subscribe((contract) => {
        this.contract = contract;
      });
  }
}
