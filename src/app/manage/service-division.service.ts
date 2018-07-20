import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MetaItemService } from '@mt-ng2/sub-entities-module';
import { IServiceDivision } from '../model/interfaces/service-division';

@Injectable()
export class ServiceDivisionService extends MetaItemService<IServiceDivision> {
    constructor (public http: HttpClient) {
        super ('ServiceDivision', 'Service Division', 'ServiceDivisionId', '/setup/servicedivisions', http);
    }
}
