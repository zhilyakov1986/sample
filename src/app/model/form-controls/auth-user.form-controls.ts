import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IAuthUser } from '../interfaces/auth-user';
import { IUserRole } from '../interfaces/user-role';

export class AuthUserDynamicControls {

    Form: IExpandableObject = {
        HasAccess: new DynamicField(
            this.formGroup,
            'Has Access',
            this.authuser && this.authuser.hasOwnProperty('HasAccess') && this.authuser.HasAccess !== null ? this.authuser.HasAccess : false,
            'HasAccess',
            new DynamicFieldType(
                DynamicFieldTypes.Checkbox,
                null,
                null,
            ),
            null,
            [  ],
            {  },
        ),
        IsEditable: new DynamicField(
            this.formGroup,
            'Is Editable',
            this.authuser && this.authuser.hasOwnProperty('IsEditable') && this.authuser.IsEditable !== null ? this.authuser.IsEditable : false,
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
        Password: new DynamicField(
            this.formGroup,
            'Password',
            this.authuser && this.authuser.hasOwnProperty('Password') && this.authuser.Password !== null ? this.authuser.Password.toString() : '',
            'Password',
            new DynamicFieldType(
                DynamicFieldTypes.Password,
                null,
                null,
            ),
            null,
            [ Validators.required ],
            { 'required': true },
        ),
        ResetKey: new DynamicField(
            this.formGroup,
            'Reset Key',
            this.authuser && this.authuser.hasOwnProperty('ResetKey') && this.authuser.ResetKey !== null ? this.authuser.ResetKey.toString() : '',
            'ResetKey',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required, Validators.maxLength(64) ],
            { 'required': true, 'maxlength': 64 },
        ),
        ResetKeyExpirationUtc: new DynamicField(
            this.formGroup,
            'Reset Key Expiration Utc',
            this.authuser && this.authuser.ResetKeyExpirationUtc || null,
            'ResetKeyExpirationUtc',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                InputTypes.Datepicker,
                null,
            ),
            null,
            [  ],
            {  },
        ),
        RoleId: new DynamicField(
            this.formGroup,
            'Role',
            this.authuser && this.authuser.hasOwnProperty('RoleId') && this.authuser.RoleId !== null ? this.authuser.RoleId : null,
            'RoleId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.roles,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
        Salt: new DynamicField(
            this.formGroup,
            'Salt',
            this.authuser && this.authuser.hasOwnProperty('Salt') && this.authuser.Salt !== null ? this.authuser.Salt.toString() : '',
            'Salt',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required, Validators.maxLength(64) ],
            { 'required': true, 'maxlength': 64 },
        ),
        Username: new DynamicField(
            this.formGroup,
            'Username',
            this.authuser && this.authuser.hasOwnProperty('Username') && this.authuser.Username !== null ? this.authuser.Username.toString() : '',
            'Username',
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
        HasAccess: new DynamicLabel(
            'Has Access',
            this.authuser && this.authuser.hasOwnProperty('HasAccess') && this.authuser.HasAccess !== null ? this.authuser.HasAccess : false,
            new DynamicFieldType(
                DynamicFieldTypes.Checkbox,
                null,
                null,
            ),
        ),
        IsEditable: new DynamicLabel(
            'Is Editable',
            this.authuser && this.authuser.hasOwnProperty('IsEditable') && this.authuser.IsEditable !== null ? this.authuser.IsEditable : false,
            new DynamicFieldType(
                DynamicFieldTypes.Checkbox,
                null,
                null,
            ),
        ),
        Password: new DynamicLabel(
            'Password',
            this.authuser && this.authuser.hasOwnProperty('Password') && this.authuser.Password !== null ? this.authuser.Password.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Password,
                null,
                null,
            ),
        ),
        ResetKey: new DynamicLabel(
            'Reset Key',
            this.authuser && this.authuser.hasOwnProperty('ResetKey') && this.authuser.ResetKey !== null ? this.authuser.ResetKey.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        ResetKeyExpirationUtc: new DynamicLabel(
            'Reset Key Expiration Utc',
            this.authuser && this.authuser.ResetKeyExpirationUtc || null,
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                InputTypes.Datepicker,
                null,
            ),
        ),
        RoleId: new DynamicLabel(
            'Role',
            this.getMetaItemValue(this.roles, this.authuser && this.authuser.hasOwnProperty('RoleId') && this.authuser.RoleId !== null ? this.authuser.RoleId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        Salt: new DynamicLabel(
            'Salt',
            this.authuser && this.authuser.hasOwnProperty('Salt') && this.authuser.Salt !== null ? this.authuser.Salt.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        Username: new DynamicLabel(
            'Username',
            this.authuser && this.authuser.hasOwnProperty('Username') && this.authuser.Username !== null ? this.authuser.Username.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
    };

    protected getMetaItemValue(source, id: number | number[]): string {
        if (!source) {
            return undefined;
        }
        if (id instanceof Array) {
            const items = source.filter((s) => (<number[]>id).some((id) => s.Id === id)).map((s) => s.Name);
            return items && items.join(', ') || undefined;
        }
        const item = source.find((s) => s.Id === id);
        return item && item.Name || undefined;
    }
    constructor(
        private authuser?: IAuthUser,
        private formGroup = 'AuthUser',
        private roles?: IUserRole[],
    ) { }
}
