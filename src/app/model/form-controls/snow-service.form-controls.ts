import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { ISnowService } from '../interfaces/snow-service';

export class SnowServiceDynamicControls {

    Form: IExpandableObject = {
        Name: new DynamicField(
            this.formGroup,
            'Name',
            this.snowservice && this.snowservice.hasOwnProperty('Name') && this.snowservice.Name !== null ? this.snowservice.Name.toString() : '',
            'Name',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required, Validators.maxLength(250) ],
            { 'required': true, 'maxlength': 250 },
        ),
    };

    View: IExpandableObject = {
        Name: new DynamicLabel(
            'Name',
            this.snowservice && this.snowservice.hasOwnProperty('Name') && this.snowservice.Name !== null ? this.snowservice.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
    };

    constructor(
        private snowservice?: ISnowService,
        private formGroup = 'SnowService',
    ) { }
}
