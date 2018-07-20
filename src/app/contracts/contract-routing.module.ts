import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, IRoleGuarded, ClaimValues } from '@mt-ng2/auth-module';
import { ContractDetailComponent } from './contract-detail/contract-detail.component';
import { ContractsComponent } from './contract-list/contracts.component';
import { ContractService } from './contract.service';
import { ContractHeaderComponent } from './contract-header/contract-header.component';
import { IEntityRouteConfig } from '@mt-ng2/entity-components-base';

import { ClaimTypes } from '../model/ClaimTypes';

const contractEntityConfig: IEntityRouteConfig = {
    claimType: ClaimTypes.Contracts,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    entityIdParam: 'contractId',
    service: ContractService,
};
const contractRoleGuard: IRoleGuarded = {
    claimType: ClaimTypes.Contracts,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
};

const contractAddRoleGuard: IRoleGuarded = {
    claimType: ClaimTypes.Contracts,
    claimValues: [ClaimValues.FullAccess],
};

const contractRoutes: Routes = [
    {
      canActivate: [AuthGuard],
      component: ContractsComponent,
      data: contractRoleGuard,
      path: 'contracts',
    },
    // settings
    {
        // canActivate: [AuthGuard],
        children: [
            { path: '', component: ContractDetailComponent, pathMatch: 'full' },
        ],
        component: ContractHeaderComponent,
        data: contractAddRoleGuard,
        path: 'contracts/add',
    },
    {
        // canActivate: [AuthGuard],
        children: [
            { path: '', component: ContractDetailComponent, pathMatch: 'full' },
        ],
        component: ContractHeaderComponent,
        data: contractEntityConfig,
        path: `contracts/:${contractEntityConfig.entityIdParam}`,
    },
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(contractRoutes)],
})
export class ContractRoutingModule {}
