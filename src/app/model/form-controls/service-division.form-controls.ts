import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IServiceDivision } from '../interfaces/service-division';

export class ServiceDivisionDynamicControls {

    Form: IExpandableObject = {
        Name: new DynamicField(
            this.formGroup,
            'Name',
            this.servicedivision && this.servicedivision.hasOwnProperty('Name') && this.servicedivision.Name !== null ? this.servicedivision.Name.toString() : '',
            'Name',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required, Validators.maxLength(50) ],
            { 'required': true, 'maxlength': 50 },
        ),
    };

    View: IExpandableObject = {
        Name: new DynamicLabel(
            'Name',
            this.servicedivision && this.servicedivision.hasOwnProperty('Name') && this.servicedivision.Name !== null ? this.servicedivision.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
    };

    constructor(
        private servicedivision?: IServiceDivision,
        private formGroup = 'ServiceDivision',
    ) { }
}
