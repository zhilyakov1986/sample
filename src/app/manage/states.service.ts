import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MetaItemService } from '@mt-ng2/sub-entities-module';
import { IState } from '../model/interfaces/state';

@Injectable()
export class StatesService extends MetaItemService<IState> {
    constructor(public http: HttpClient) {
        super('StatesService', 'State', 'StateIds', '/manage/states', http);
    }
}
