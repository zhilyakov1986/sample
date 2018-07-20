import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IUser } from '../interfaces/user';
import { IAddress } from '../interfaces/address';
import { IAuthUser } from '../interfaces/auth-user';
import { IImage } from '../interfaces/image';

export class UserDynamicControls {

    Form: IExpandableObject = {
        AddressId: new DynamicField(
            this.formGroup,
            'Address',
            this.user && this.user.hasOwnProperty('AddressId') && this.user.AddressId !== null ? this.user.AddressId : null,
            'AddressId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.addresses,
            [  ],
            {  },
        ),
        AuthUserId: new DynamicField(
            this.formGroup,
            'Auth User',
            this.user && this.user.hasOwnProperty('AuthUserId') && this.user.AuthUserId !== null ? this.user.AuthUserId : null,
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
        Email: new DynamicField(
            this.formGroup,
            'Email',
            this.user && this.user.hasOwnProperty('Email') && this.user.Email !== null ? this.user.Email.toString() : '',
            'Email',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required, Validators.maxLength(50), Validators.email ],
            { 'required': true, 'maxlength': 50, 'email': true },
        ),
        FirstName: new DynamicField(
            this.formGroup,
            'First Name',
            this.user && this.user.hasOwnProperty('FirstName') && this.user.FirstName !== null ? this.user.FirstName.toString() : '',
            'FirstName',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required, Validators.maxLength(50) ],
            { 'required': true, 'maxlength': 50 },
        ),
        ImageId: new DynamicField(
            this.formGroup,
            'Image',
            this.user && this.user.hasOwnProperty('ImageId') && this.user.ImageId !== null ? this.user.ImageId : null,
            'ImageId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.images,
            [  ],
            {  },
        ),
        LastName: new DynamicField(
            this.formGroup,
            'Last Name',
            this.user && this.user.hasOwnProperty('LastName') && this.user.LastName !== null ? this.user.LastName.toString() : '',
            'LastName',
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
        AddressId: new DynamicLabel(
            'Address',
            this.getMetaItemValue(this.addresses, this.user && this.user.hasOwnProperty('AddressId') && this.user.AddressId !== null ? this.user.AddressId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        AuthUserId: new DynamicLabel(
            'Auth User',
            this.getMetaItemValue(this.authusers, this.user && this.user.hasOwnProperty('AuthUserId') && this.user.AuthUserId !== null ? this.user.AuthUserId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        Email: new DynamicLabel(
            'Email',
            this.user && this.user.hasOwnProperty('Email') && this.user.Email !== null ? this.user.Email.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        FirstName: new DynamicLabel(
            'First Name',
            this.user && this.user.hasOwnProperty('FirstName') && this.user.FirstName !== null ? this.user.FirstName.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        ImageId: new DynamicLabel(
            'Image',
            this.getMetaItemValue(this.images, this.user && this.user.hasOwnProperty('ImageId') && this.user.ImageId !== null ? this.user.ImageId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        LastName: new DynamicLabel(
            'Last Name',
            this.user && this.user.hasOwnProperty('LastName') && this.user.LastName !== null ? this.user.LastName.toString() : '',
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
        private user?: IUser,
        private formGroup = 'User',
        private addresses?: IAddress[],
        private authusers?: IAuthUser[],
        private images?: IImage[],
    ) { }
}
