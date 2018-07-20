import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IClaimType } from '../interfaces/claim-type';

export class ClaimTypeDynamicControls {

    Form: IExpandableObject = {
        Name: new DynamicField(
            this.formGroup,
            'Name',
            this.claimtype && this.claimtype.hasOwnProperty('Name') && this.claimtype.Name !== null ? this.claimtype.Name.toString() : '',
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
            this.claimtype && this.claimtype.hasOwnProperty('Name') && this.claimtype.Name !== null ? this.claimtype.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
    };

    constructor(
        private claimtype?: IClaimType,
        private formGroup = 'ClaimType',
    ) { }
}
