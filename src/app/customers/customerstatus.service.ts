import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MetaItemService } from '@mt-ng2/sub-entities-module';
import { ICustomerStatus } from '../model/interfaces/customer-status';

@Injectable()
export class CustomerStatusService extends MetaItemService<ICustomerStatus>  {

    constructor(public http: HttpClient) {
        super('CustomerStatusService', 'Status', 'StatusIds', '/customerstatuses', http);
    }

}
