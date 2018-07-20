import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MetaItemService } from '@mt-ng2/sub-entities-module';
import { ICustomerSource } from '../model/interfaces/customer-source';

@Injectable()
export class CustomerSourceService extends MetaItemService<ICustomerSource>  {

    constructor(public http: HttpClient) {
        super('CustomerSourceService', 'Source', 'SourceIds', '/customersources', http);
    }

}
