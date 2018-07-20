import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IServiceLongDescription } from '../interfaces/service-long-description';

export class ServiceLongDescriptionDynamicControls {

    Form: IExpandableObject = {
        Name: new DynamicField(
            this.formGroup,
            'Name',
            this.servicelongdescription && this.servicelongdescription.hasOwnProperty('Name') && this.servicelongdescription.Name !== null ? this.servicelongdescription.Name.toString() : '',
            'Name',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required ],
            { 'required': true },
        ),
    };

    View: IExpandableObject = {
        Name: new DynamicLabel(
            'Name',
            this.servicelongdescription && this.servicelongdescription.hasOwnProperty('Name') && this.servicelongdescription.Name !== null ? this.servicelongdescription.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
    };

    constructor(
        private servicelongdescription?: IServiceLongDescription,
        private formGroup = 'ServiceLongDescription',
    ) { }
}
