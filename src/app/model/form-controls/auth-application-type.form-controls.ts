import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IAuthApplicationType } from '../interfaces/auth-application-type';

export class AuthApplicationTypeDynamicControls {

    Form: IExpandableObject = {
        Name: new DynamicField(
            this.formGroup,
            'Name',
            this.authapplicationtype && this.authapplicationtype.hasOwnProperty('Name') && this.authapplicationtype.Name !== null ? this.authapplicationtype.Name.toString() : '',
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
            this.authapplicationtype && this.authapplicationtype.hasOwnProperty('Name') && this.authapplicationtype.Name !== null ? this.authapplicationtype.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
    };

    constructor(
        private authapplicationtype?: IAuthApplicationType,
        private formGroup = 'AuthApplicationType',
    ) { }
}
