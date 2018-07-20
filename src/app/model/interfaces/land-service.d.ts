import { IEntity } from './base';

import { IServiceDivisionDetail } from './service-division-detail';

export interface ILandService extends IEntity {
    Name: string;

    // reverse nav
    ServiceDivisionDetails?: IServiceDivisionDetail[];
}
