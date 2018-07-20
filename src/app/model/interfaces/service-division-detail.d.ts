import { IEntity } from './base';

import { ILandService } from './land-service';
import { ISnowService } from './snow-service';

export interface IServiceDivisionDetail extends IEntity {
    LandServiceId: number;
    SnowServiceId: number;

    // foreign keys
    LandService?: ILandService;
    SnowService?: ISnowService;
}
