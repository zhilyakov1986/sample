import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { ICustomerSource } from '../interfaces/customer-source';

export class CustomerSourceDynamicControls {

    Form: IExpandableObject = {
        Name: new DynamicField(
            this.formGroup,
            'Name',
            this.customersource && this.customersource.hasOwnProperty('Name') && this.customersource.Name !== null ? this.customersource.Name.toString() : '',
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
            this.customersource && this.customersource.Sort || null,
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
            this.customersource && this.customersource.hasOwnProperty('Name') && this.customersource.Name !== null ? this.customersource.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        Sort: new DynamicLabel(
            'Sort',
            this.customersource && this.customersource.Sort || null,
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                NumericInputTypes.Integer,
                null,
            ),
        ),
    };

    constructor(
        private customersource?: ICustomerSource,
        private formGroup = 'CustomerSource',
    ) { }
}
