import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IUserRole } from '../interfaces/user-role';

export class UserRoleDynamicControls {

    Form: IExpandableObject = {
        Description: new DynamicField(
            this.formGroup,
            'Description',
            this.userrole && this.userrole.hasOwnProperty('Description') && this.userrole.Description !== null ? this.userrole.Description.toString() : '',
            'Description',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.maxLength(500) ],
            { 'maxlength': 500 },
        ),
        IsEditable: new DynamicField(
            this.formGroup,
            'Is Editable',
            this.userrole && this.userrole.hasOwnProperty('IsEditable') && this.userrole.IsEditable !== null ? this.userrole.IsEditable : false,
            'IsEditable',
            new DynamicFieldType(
                DynamicFieldTypes.Checkbox,
                null,
                null,
            ),
            null,
            [  ],
            {  },
        ),
        Name: new DynamicField(
            this.formGroup,
            'Name',
            this.userrole && this.userrole.hasOwnProperty('Name') && this.userrole.Name !== null ? this.userrole.Name.toString() : '',
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
        Description: new DynamicLabel(
            'Description',
            this.userrole && this.userrole.hasOwnProperty('Description') && this.userrole.Description !== null ? this.userrole.Description.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        IsEditable: new DynamicLabel(
            'Is Editable',
            this.userrole && this.userrole.hasOwnProperty('IsEditable') && this.userrole.IsEditable !== null ? this.userrole.IsEditable : false,
            new DynamicFieldType(
                DynamicFieldTypes.Checkbox,
                null,
                null,
            ),
        ),
        Name: new DynamicLabel(
            'Name',
            this.userrole && this.userrole.hasOwnProperty('Name') && this.userrole.Name !== null ? this.userrole.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
    };

    constructor(
        private userrole?: IUserRole,
        private formGroup = 'UserRole',
    ) { }
}
