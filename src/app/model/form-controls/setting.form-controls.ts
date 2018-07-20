import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { ISetting } from '../interfaces/setting';

export class SettingDynamicControls {

    Form: IExpandableObject = {
        Name: new DynamicField(
            this.formGroup,
            'Name',
            this.setting && this.setting.hasOwnProperty('Name') && this.setting.Name !== null ? this.setting.Name.toString() : '',
            'Name',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.maxLength(50) ],
            { 'maxlength': 50 },
        ),
        Value: new DynamicField(
            this.formGroup,
            'Value',
            this.setting && this.setting.hasOwnProperty('Value') && this.setting.Value !== null ? this.setting.Value.toString() : '',
            'Value',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.maxLength(50) ],
            { 'maxlength': 50 },
        ),
    };

    View: IExpandableObject = {
        Name: new DynamicLabel(
            'Name',
            this.setting && this.setting.hasOwnProperty('Name') && this.setting.Name !== null ? this.setting.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        Value: new DynamicLabel(
            'Value',
            this.setting && this.setting.hasOwnProperty('Value') && this.setting.Value !== null ? this.setting.Value.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
    };

    constructor(
        private setting?: ISetting,
        private formGroup = 'Setting',
    ) { }
}
