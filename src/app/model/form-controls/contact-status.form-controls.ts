import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IContactStatus } from '../interfaces/contact-status';

export class ContactStatusDynamicControls {

    Form: IExpandableObject = {
        Name: new DynamicField(
            this.formGroup,
            'Name',
            this.contactstatus && this.contactstatus.hasOwnProperty('Name') && this.contactstatus.Name !== null ? this.contactstatus.Name.toString() : '',
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
            this.contactstatus && this.contactstatus.Sort || null,
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
            this.contactstatus && this.contactstatus.hasOwnProperty('Name') && this.contactstatus.Name !== null ? this.contactstatus.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        Sort: new DynamicLabel(
            'Sort',
            this.contactstatus && this.contactstatus.Sort || null,
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                NumericInputTypes.Integer,
                null,
            ),
        ),
    };

    constructor(
        private contactstatus?: IContactStatus,
        private formGroup = 'ContactStatus',
    ) { }
}
