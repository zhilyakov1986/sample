import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { ILandService } from '../interfaces/land-service';

export class LandServiceDynamicControls {

    Form: IExpandableObject = {
        Name: new DynamicField(
            this.formGroup,
            'Name',
            this.landservice && this.landservice.hasOwnProperty('Name') && this.landservice.Name !== null ? this.landservice.Name.toString() : '',
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
            this.landservice && this.landservice.hasOwnProperty('Name') && this.landservice.Name !== null ? this.landservice.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
    };

    constructor(
        private landservice?: ILandService,
        private formGroup = 'LandService',
    ) { }
}
