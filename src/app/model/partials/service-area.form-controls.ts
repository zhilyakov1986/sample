import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import {
    DynamicField,
    DynamicFieldType,
    DynamicFieldTypes,
    DynamicLabel,
    noZeroRequiredValidator,
    InputTypes,
    NumericInputTypes,
    SelectInputTypes,
} from '@mt-ng2/dynamic-form';

import { ContractDynamicControls } from '../form-controls/contract.form-controls';
import { IServiceArea } from '../interfaces/service-area';
import { ServiceAreaDynamicControls } from '../form-controls/service-area.form-controls';

export class ServiceAreaDynamicControlsPartial extends ServiceAreaDynamicControls {
    constructor(
        private serviceareaPartial?: IServiceArea,
        private formGroupPartial = 'ServiceArea',
    ) {
        super(serviceareaPartial, formGroupPartial);

        (<DynamicField>this.Form.Name).type.fieldType =
            DynamicFieldTypes.Select;
        (<DynamicField>this.View.Name).type.fieldType =
            DynamicFieldTypes.Select;
    }
}
