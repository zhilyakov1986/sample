import { IEntity } from './base';

import { IServiceDivisionDetail } from './service-division-detail';

export interface ISnowService extends IEntity {
    Name: string;

    // reverse nav
    ServiceDivisionDetails?: IServiceDivisionDetail[];
}
