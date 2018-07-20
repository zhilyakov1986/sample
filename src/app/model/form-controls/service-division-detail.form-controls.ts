import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IServiceDivisionDetail } from '../interfaces/service-division-detail';
import { ILandService } from '../interfaces/land-service';
import { ISnowService } from '../interfaces/snow-service';

export class ServiceDivisionDetailDynamicControls {

    Form: IExpandableObject = {
        LandServiceId: new DynamicField(
            this.formGroup,
            'Land Service',
            this.servicedivisiondetail && this.servicedivisiondetail.hasOwnProperty('LandServiceId') && this.servicedivisiondetail.LandServiceId !== null ? this.servicedivisiondetail.LandServiceId : null,
            'LandServiceId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.landservices,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
        SnowServiceId: new DynamicField(
            this.formGroup,
            'Snow Service',
            this.servicedivisiondetail && this.servicedivisiondetail.hasOwnProperty('SnowServiceId') && this.servicedivisiondetail.SnowServiceId !== null ? this.servicedivisiondetail.SnowServiceId : null,
            'SnowServiceId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.snowservices,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
    };

    View: IExpandableObject = {
        LandServiceId: new DynamicLabel(
            'Land Service',
            this.getMetaItemValue(this.landservices, this.servicedivisiondetail && this.servicedivisiondetail.hasOwnProperty('LandServiceId') && this.servicedivisiondetail.LandServiceId !== null ? this.servicedivisiondetail.LandServiceId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        SnowServiceId: new DynamicLabel(
            'Snow Service',
            this.getMetaItemValue(this.snowservices, this.servicedivisiondetail && this.servicedivisiondetail.hasOwnProperty('SnowServiceId') && this.servicedivisiondetail.SnowServiceId !== null ? this.servicedivisiondetail.SnowServiceId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
    };

    protected getMetaItemValue(source, id: number | number[]): string {
        if (!source) {
            return undefined;
        }
        if (id instanceof Array) {
            const items = source.filter((s) => (<number[]>id).some((id) => s.Id === id)).map((s) => s.Name);
            return items && items.join(', ') || undefined;
        }
        const item = source.find((s) => s.Id === id);
        return item && item.Name || undefined;
    }
    constructor(
        private servicedivisiondetail?: IServiceDivisionDetail,
        private formGroup = 'ServiceDivisionDetail',
        private landservices?: ILandService[],
        private snowservices?: ISnowService[],
    ) { }
}
