import {
    Component,
    Output,
    OnInit,
    EventEmitter,
    OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { IContract } from '../../model/interfaces/contract';
import { ContractService } from '../contract.service';
import { Subscription } from 'rxjs/Subscription';
import { ContractStatusService } from '../contractstatus.service';
import { IContractStatus } from '../../model/interfaces/contract-status';
import { UserRoleEnum } from '../../common/user-roles-enum';
import { ContractStatusEnum } from '../../common/contract-statuses-enum';
import { IServiceArea } from '../../model/interfaces/service-area';
import { IServiceDivision } from '../../model/interfaces/service-division';

@Component({
    selector: 'app-contract-header',
    styles: [
        `
            b {
                color: black;
            }
        `,
    ],
    templateUrl: './contract-header.component.html',
})
export class ContractHeaderComponent implements OnInit, OnDestroy {
    contract: IContract;
    header: string;
    routeSubscription: Subscription;
    basicInfoSubscription: Subscription;
    statusName: string;
    currentId: number;
    currentContract: IContract;
    currenDate = new Date();
    addActionStatusBar = true;
    currentUserRole: any;
    serviceDivision: IServiceDivision;
    showApproved = false;
    showCanceled = false;
    showExpired = false;
    showPending = false;

    constructor(
        private contractStatusService: ContractStatusService,
        private notificationsService: NotificationsService,
        private contractService: ContractService,
        private route: ActivatedRoute,
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

        this.basicInfoSubscription = contractService.changeEmitted$.subscribe(
            (contract) => {
                this.ngOnInit();
            },
        );
    }

    ngOnInit(): void {
        const id = +this.route.snapshot.paramMap.get('contractId');
        if (id > 0) {
            this.currentId = id;
            this.getContractById(id);
        } else {
            this.addActionStatusBar = false;
            this.header = 'Add Contract';
            this.contract = this.contractService.getEmptyContract();
        }
        this.toExpiredFromEnvironment();
    }

    ngOnDestroy(): void {
        this.routeSubscription.unsubscribe();
        this.basicInfoSubscription.unsubscribe();
    }

    getContractById(id: number): void {
        this.contractService.getById(id).subscribe((contract) => {
            this.contract = contract;
            this.contractStatusService
                .getById(contract.StatusId)
                .subscribe((success) => {
                    this.statusName = success.Name;
                });
            this.header = `Contract: ${contract.Number} `;
            this.contractService.getUserRole(this.contract.UserId).subscribe(
                (success) => {
                    this.currentUserRole = success;
                    this.setAvailableButtons();
                },
                (err) =>
                    this.notificationsService.error(
                        'Failed to get User Role for contract',
                    ),
            );
        });
    }
    setAvailableButtons(): void {
        if (
            this.currentUserRole === UserRoleEnum.Administrator ||
            this.currentUserRole === UserRoleEnum.Director
        ) {
            if (this.contract.StatusId === ContractStatusEnum.Approved) {
                this.showApproved = false;
                this.showPending = true;
                this.showExpired = true;
            }
            if (this.contract.StatusId === ContractStatusEnum.Expired) {
                this.showApproved = true;
                this.showCanceled = false;
                this.showExpired = false;
            }
            if (this.contract.StatusId === ContractStatusEnum.Pending) {
                this.showPending = false;
                this.showApproved = true;
                this.showCanceled = true;
            }
            if (this.contract.StatusId === ContractStatusEnum.Cancelled) {
                this.showCanceled = false;
                this.showPending = true;
            }
        } else {
            if (this.contract.StatusId === ContractStatusEnum.Cancelled) {
                this.showCanceled = false;
                this.showPending = true;
            } else {
                this.showCanceled = true;
            }
        }
    }

    dateCheck(): boolean {
        let contractEndDate = new Date(this.contract.EndDate);
        if (contractEndDate > this.currenDate) {
            return true;
        } else {
            this.notificationsService.error(
                'Contract End Date Can not be in the past',
            );
            return false;
        }
    }

    toApproved(): void {
        if (this.dateCheck) {
            this.contract.StatusId = ContractStatusEnum.Approved;
            this.updateContract();
        }
    }

    toPending(): void {
        if (this.dateCheck) {
            this.contract.StatusId = ContractStatusEnum.Pending;
            this.updateContract();
        }
    }

    toCanceled(): void {
        if (this.dateCheck) {
            this.contract.StatusId = ContractStatusEnum.Cancelled;
            this.updateContract();
        }
    }
    toExpired(): void {
        if (this.dateCheck) {
            this.contract.StatusId = ContractStatusEnum.Expired;
            this.updateContract();
        }
    }
    // TO DO AZ make the environment to set the status to expired after an end date
    toExpiredFromEnvironment(): void {
        if (!this.dateCheck) {
            this.contract.StatusId = ContractStatusEnum.Expired;
            this.updateContract();
        }
    }

    updateContract(): void {
        this.contractService
            .update(this.contract)
            .subscribe(() => this.contractService.emitChange(this.contract));
    }
}
