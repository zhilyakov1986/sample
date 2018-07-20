import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IServiceShortDescription } from '../interfaces/service-short-description';

export class ServiceShortDescriptionDynamicControls {

    Form: IExpandableObject = {
        Name: new DynamicField(
            this.formGroup,
            'Name',
            this.serviceshortdescription && this.serviceshortdescription.hasOwnProperty('Name') && this.serviceshortdescription.Name !== null ? this.serviceshortdescription.Name.toString() : '',
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
            this.serviceshortdescription && this.serviceshortdescription.hasOwnProperty('Name') && this.serviceshortdescription.Name !== null ? this.serviceshortdescription.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
    };

    constructor(
        private serviceshortdescription?: IServiceShortDescription,
        private formGroup = 'ServiceShortDescription',
    ) { }
}
