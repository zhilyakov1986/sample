import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { ICustomerStatus } from '../interfaces/customer-status';

export class CustomerStatusDynamicControls {

    Form: IExpandableObject = {
        Name: new DynamicField(
            this.formGroup,
            'Name',
            this.customerstatus && this.customerstatus.hasOwnProperty('Name') && this.customerstatus.Name !== null ? this.customerstatus.Name.toString() : '',
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
        Sort: new DynamicField(
            this.formGroup,
            'Sort',
            this.customerstatus && this.customerstatus.Sort || null,
            'Sort',
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                NumericInputTypes.Integer,
                null,
            ),
            null,
            [  ],
            {  },
        ),
    };

    View: IExpandableObject = {
        Name: new DynamicLabel(
            'Name',
            this.customerstatus && this.customerstatus.hasOwnProperty('Name') && this.customerstatus.Name !== null ? this.customerstatus.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        Sort: new DynamicLabel(
            'Sort',
            this.customerstatus && this.customerstatus.Sort || null,
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                NumericInputTypes.Integer,
                null,
            ),
        ),
    };

    constructor(
        private customerstatus?: ICustomerStatus,
        private formGroup = 'CustomerStatus',
    ) { }
}
