import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { ISubcontractorStatus } from '../interfaces/subcontractor-status';

export class SubcontractorStatusDynamicControls {

    Form: IExpandableObject = {
        Name: new DynamicField(
            this.formGroup,
            'Name',
            this.subcontractorstatus && this.subcontractorstatus.hasOwnProperty('Name') && this.subcontractorstatus.Name !== null ? this.subcontractorstatus.Name.toString() : '',
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
            this.subcontractorstatus && this.subcontractorstatus.hasOwnProperty('Name') && this.subcontractorstatus.Name !== null ? this.subcontractorstatus.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
    };

    constructor(
        private subcontractorstatus?: ISubcontractorStatus,
        private formGroup = 'SubcontractorStatus',
    ) { }
}
