import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IAuthClient } from '../interfaces/auth-client';
import { IAuthApplicationType } from '../interfaces/auth-application-type';

export class AuthClientDynamicControls {

    Form: IExpandableObject = {
        AllowedOrigin: new DynamicField(
            this.formGroup,
            'Allowed Origin',
            this.authclient && this.authclient.hasOwnProperty('AllowedOrigin') && this.authclient.AllowedOrigin !== null ? this.authclient.AllowedOrigin.toString() : '',
            'AllowedOrigin',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required, Validators.maxLength(500) ],
            { 'required': true, 'maxlength': 500 },
        ),
        AuthApplicationTypeId: new DynamicField(
            this.formGroup,
            'Auth Application Type',
            this.authclient && this.authclient.hasOwnProperty('AuthApplicationTypeId') && this.authclient.AuthApplicationTypeId !== null ? this.authclient.AuthApplicationTypeId : null,
            'AuthApplicationTypeId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.authapplicationtypes,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
        Description: new DynamicField(
            this.formGroup,
            'Description',
            this.authclient && this.authclient.hasOwnProperty('Description') && this.authclient.Description !== null ? this.authclient.Description.toString() : '',
            'Description',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.maxLength(200) ],
            { 'maxlength': 200 },
        ),
        Name: new DynamicField(
            this.formGroup,
            'Name',
            this.authclient && this.authclient.hasOwnProperty('Name') && this.authclient.Name !== null ? this.authclient.Name.toString() : '',
            'Name',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required, Validators.maxLength(200) ],
            { 'required': true, 'maxlength': 200 },
        ),
        RefreshTokenMinutes: new DynamicField(
            this.formGroup,
            'Refresh Token Minutes',
            this.authclient && this.authclient.RefreshTokenMinutes || null,
            'RefreshTokenMinutes',
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                NumericInputTypes.Integer,
                null,
            ),
            null,
            [ Validators.required ],
            { 'required': true },
        ),
        Salt: new DynamicField(
            this.formGroup,
            'Salt',
            this.authclient && this.authclient.hasOwnProperty('Salt') && this.authclient.Salt !== null ? this.authclient.Salt.toString() : '',
            'Salt',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required ],
            { 'required': true },
        ),
        Secret: new DynamicField(
            this.formGroup,
            'Secret',
            this.authclient && this.authclient.hasOwnProperty('Secret') && this.authclient.Secret !== null ? this.authclient.Secret.toString() : '',
            'Secret',
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
        AllowedOrigin: new DynamicLabel(
            'Allowed Origin',
            this.authclient && this.authclient.hasOwnProperty('AllowedOrigin') && this.authclient.AllowedOrigin !== null ? this.authclient.AllowedOrigin.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        AuthApplicationTypeId: new DynamicLabel(
            'Auth Application Type',
            this.getMetaItemValue(this.authapplicationtypes, this.authclient && this.authclient.hasOwnProperty('AuthApplicationTypeId') && this.authclient.AuthApplicationTypeId !== null ? this.authclient.AuthApplicationTypeId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        Description: new DynamicLabel(
            'Description',
            this.authclient && this.authclient.hasOwnProperty('Description') && this.authclient.Description !== null ? this.authclient.Description.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        Name: new DynamicLabel(
            'Name',
            this.authclient && this.authclient.hasOwnProperty('Name') && this.authclient.Name !== null ? this.authclient.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        RefreshTokenMinutes: new DynamicLabel(
            'Refresh Token Minutes',
            this.authclient && this.authclient.RefreshTokenMinutes || null,
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                NumericInputTypes.Integer,
                null,
            ),
        ),
        Salt: new DynamicLabel(
            'Salt',
            this.authclient && this.authclient.hasOwnProperty('Salt') && this.authclient.Salt !== null ? this.authclient.Salt.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        Secret: new DynamicLabel(
            'Secret',
            this.authclient && this.authclient.hasOwnProperty('Secret') && this.authclient.Secret !== null ? this.authclient.Secret.toString() : '',
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
        private authclient?: IAuthClient,
        private formGroup = 'AuthClient',
        private authapplicationtypes?: IAuthApplicationType[],
    ) { }
}
