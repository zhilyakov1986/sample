import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IState } from '../interfaces/state';

export class StateDynamicControls {

    Form: IExpandableObject = {
        Name: new DynamicField(
            this.formGroup,
            'Name',
            this.state && this.state.hasOwnProperty('Name') && this.state.Name !== null ? this.state.Name.toString() : '',
            'Name',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required, Validators.maxLength(64) ],
            { 'required': true, 'maxlength': 64 },
        ),
        StateCode: new DynamicField(
            this.formGroup,
            'State Code',
            this.state && this.state.hasOwnProperty('StateCode') && this.state.StateCode !== null ? this.state.StateCode.toString() : '',
            'StateCode',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required, Validators.maxLength(2) ],
            { 'required': true, 'maxlength': 2 },
        ),
        TaxRate: new DynamicField(
            this.formGroup,
            'Tax Rate',
            this.state && this.state.TaxRate || null,
            'TaxRate',
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                null,
                6,
            ),
            null,
            [  ],
            {  },
        ),
    };

    View: IExpandableObject = {
        Name: new DynamicLabel(
            'Name',
            this.state && this.state.hasOwnProperty('Name') && this.state.Name !== null ? this.state.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        StateCode: new DynamicLabel(
            'State Code',
            this.state && this.state.hasOwnProperty('StateCode') && this.state.StateCode !== null ? this.state.StateCode.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        TaxRate: new DynamicLabel(
            'Tax Rate',
            this.state && this.state.TaxRate || null,
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                null,
                6,
            ),
        ),
    };

    constructor(
        private state?: IState,
        private formGroup = 'State',
    ) { }
}
