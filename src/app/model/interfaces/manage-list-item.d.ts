import { IEntity } from './base';

import { IServiceArea } from './service-area';
import { IServiceDivision } from './service-division';
import { IUnitType } from './unit-type';

export interface IManageListItem extends IEntity {
    ServiceDivisionId: number;
    ServiceAreaId: number;
    UnitTypeId: number;

    // foreign keys
    ServiceArea?: IServiceArea;
    ServiceDivision?: IServiceDivision;
    UnitType?: IUnitType;
}
