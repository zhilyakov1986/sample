import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IAuthToken } from '../interfaces/auth-token';
import { IAuthClient } from '../interfaces/auth-client';
import { IAuthUser } from '../interfaces/auth-user';

export class AuthTokenDynamicControls {

    Form: IExpandableObject = {
        AuthClientId: new DynamicField(
            this.formGroup,
            'Auth Client',
            this.authtoken && this.authtoken.hasOwnProperty('AuthClientId') && this.authtoken.AuthClientId !== null ? this.authtoken.AuthClientId : null,
            'AuthClientId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.authclients,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
        AuthUserId: new DynamicField(
            this.formGroup,
            'Auth User',
            this.authtoken && this.authtoken.hasOwnProperty('AuthUserId') && this.authtoken.AuthUserId !== null ? this.authtoken.AuthUserId : null,
            'AuthUserId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.authusers,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
        ExpiresUtc: new DynamicField(
            this.formGroup,
            'Expires Utc',
            this.authtoken && this.authtoken.ExpiresUtc || null,
            'ExpiresUtc',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                InputTypes.Datepicker,
                null,
            ),
            null,
            [ Validators.required ],
            { 'required': true },
        ),
        IdentifierKey: new DynamicField(
            this.formGroup,
            'Identifier Key',
            this.authtoken && this.authtoken.hasOwnProperty('IdentifierKey') && this.authtoken.IdentifierKey !== null ? this.authtoken.IdentifierKey.toString() : '',
            'IdentifierKey',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required, Validators.maxLength(64) ],
            { 'required': true, 'maxlength': 64 },
        ),
        IssuedUtc: new DynamicField(
            this.formGroup,
            'Issued Utc',
            this.authtoken && this.authtoken.IssuedUtc || null,
            'IssuedUtc',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                InputTypes.Datepicker,
                null,
            ),
            null,
            [ Validators.required ],
            { 'required': true },
        ),
        Salt: new DynamicField(
            this.formGroup,
            'Salt',
            this.authtoken && this.authtoken.hasOwnProperty('Salt') && this.authtoken.Salt !== null ? this.authtoken.Salt.toString() : '',
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
        Token: new DynamicField(
            this.formGroup,
            'Token',
            this.authtoken && this.authtoken.hasOwnProperty('Token') && this.authtoken.Token !== null ? this.authtoken.Token.toString() : '',
            'Token',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required ],
            { 'required': true },
        ),
    };

    View: IExpandableObject = {
        AuthClientId: new DynamicLabel(
            'Auth Client',
            this.getMetaItemValue(this.authclients, this.authtoken && this.authtoken.hasOwnProperty('AuthClientId') && this.authtoken.AuthClientId !== null ? this.authtoken.AuthClientId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        AuthUserId: new DynamicLabel(
            'Auth User',
            this.getMetaItemValue(this.authusers, this.authtoken && this.authtoken.hasOwnProperty('AuthUserId') && this.authtoken.AuthUserId !== null ? this.authtoken.AuthUserId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        ExpiresUtc: new DynamicLabel(
            'Expires Utc',
            this.authtoken && this.authtoken.ExpiresUtc || null,
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                InputTypes.Datepicker,
                null,
            ),
        ),
        IdentifierKey: new DynamicLabel(
            'Identifier Key',
            this.authtoken && this.authtoken.hasOwnProperty('IdentifierKey') && this.authtoken.IdentifierKey !== null ? this.authtoken.IdentifierKey.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        IssuedUtc: new DynamicLabel(
            'Issued Utc',
            this.authtoken && this.authtoken.IssuedUtc || null,
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                InputTypes.Datepicker,
                null,
            ),
        ),
        Salt: new DynamicLabel(
            'Salt',
            this.authtoken && this.authtoken.hasOwnProperty('Salt') && this.authtoken.Salt !== null ? this.authtoken.Salt.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        Token: new DynamicLabel(
            'Token',
            this.authtoken && this.authtoken.hasOwnProperty('Token') && this.authtoken.Token !== null ? this.authtoken.Token.toString() : '',
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
        private authtoken?: IAuthToken,
        private formGroup = 'AuthToken',
        private authclients?: IAuthClient[],
        private authusers?: IAuthUser[],
    ) { }
}
