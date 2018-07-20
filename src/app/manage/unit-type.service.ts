import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MetaItemService } from '@mt-ng2/sub-entities-module';
import { IUnitType } from '../model/interfaces/unit-type';

@Injectable()
export class UnitTypeService extends MetaItemService<IUnitType> {
    constructor (public http: HttpClient) {
        super ('UnitType', 'Unit Type', 'UnitTypeId', '/setup/unittypes', http);
    }
}
