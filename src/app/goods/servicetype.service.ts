import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MetaItemService } from '@mt-ng2/sub-entities-module';
import { IServiceType } from '../model/interfaces/service-type';

@Injectable()
export class ServiceTypeService extends MetaItemService<IServiceType> {

  constructor(public http: HttpClient) {
    super('ServiceTypeService', 'Type', 'TypeIds', '/servicetypes', http);
  }

}
