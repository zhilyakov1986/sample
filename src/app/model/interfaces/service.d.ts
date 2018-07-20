import { IEntity } from './base';

import { IServiceLongDescription } from './service-long-description';
import { IServiceShortDescription } from './service-short-description';
import { IServiceType } from './service-type';
import { IServiceDivision } from './service-division';
import { IUnitType } from './unit-type';

export interface IService extends IEntity {
    Name: string;
    ServiceDivisionId: number;
    ServiceTypeId: number;
    ServiceShortDescriptionId: number;
    ServiceLongDescriptionId: number;
    UnitTypeId: number;
    Cost: number;
    Price: number;
    Taxable: boolean;

    // foreign keys
    ToServiceLongDescription?: IServiceLongDescription;
    ToServiceShortDescription?: IServiceShortDescription;
    ToServiceType?: IServiceType;
    ToServiceDivision?: IServiceDivision;
    ToUnitTypeId?: IUnitType;
}
