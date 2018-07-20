import { IEntity, IVersionable, IDocument } from './base';

import { ILocationService } from './location-service';
import { IServiceDivision } from './service-division';
import { IServiceType } from './service-type';
import { IUnitType } from './unit-type';

export interface IGood extends IEntity, IVersionable {
    Name: string;
    ServiceDivisionId: number;
    ServiceTypeId: number;
    ServiceShortDescription: string;
    ServiceLongDescription: string;
    UnitTypeId: number;
    Cost: number;
    Price: number;
    Taxable: boolean;
    Archived: boolean;

    // reverse nav
    Documents?: IDocument[];
    LocationServices?: ILocationService[];

    // foreign keys
    ServiceDivision?: IServiceDivision;
    ServiceType?: IServiceType;
    UnitType?: IUnitType;
}
