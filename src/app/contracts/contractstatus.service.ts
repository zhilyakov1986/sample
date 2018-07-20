import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { StaticMetaItemService } from '@mt-ng2/sub-entities-module';
import { IContractStatus } from '../model/interfaces/contract-status';
import { Observable } from 'rxjs';

@Injectable()
export class ContractStatusService extends StaticMetaItemService<
    IContractStatus
> {
    constructor(public http: HttpClient) {
        super(
            'ContractStatusService',
            'Status',
            'StatusIds',
            '/setup/statuses',
            http,
        );
    }
}
