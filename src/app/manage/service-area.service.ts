import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MetaItemService } from '@mt-ng2/sub-entities-module';
import { IServiceArea } from '../model/interfaces/service-area';

@Injectable()
export class ServiceAreaService extends MetaItemService<IServiceArea> {
    constructor (public http: HttpClient) {
        super ('ServiceArea', 'Service Area', 'ServiceAreaId', '/setup/serviceareas', http);
    }
}
