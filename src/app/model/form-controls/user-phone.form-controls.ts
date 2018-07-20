import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IUserPhone } from '../interfaces/user-phone';
import { IUser } from '../interfaces/user';

export class UserPhoneDynamicControls {

    Form: IExpandableObject = {
        Extension: new DynamicField(
            this.formGroup,
            'Extension',
            this.userphone && this.userphone.hasOwnProperty('Extension') && this.userphone.Extension !== null ? this.userphone.Extension.toString() : '',
            'Extension',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.maxLength(5) ],
            { 'maxlength': 5 },
        ),
        IsPrimary: new DynamicField(
            this.formGroup,
            'Is Primary',
            this.userphone && this.userphone.hasOwnProperty('IsPrimary') && this.userphone.IsPrimary !== null ? this.userphone.IsPrimary : false,
            'IsPrimary',
            new DynamicFieldType(
                DynamicFieldTypes.Checkbox,
                null,
                null,
            ),
            null,
            [  ],
            {  },
        ),
        Phone: new DynamicField(
            this.formGroup,
            'Phone',
            this.userphone && this.userphone.hasOwnProperty('Phone') && this.userphone.Phone !== null ? this.userphone.Phone.toString() : '',
            'Phone',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required, Validators.maxLength(20) ],
            { 'required': true, 'maxlength': 20 },
        ),
        PhoneTypeId: new DynamicField(
            this.formGroup,
            'Phone Type',
            this.userphone && this.userphone.hasOwnProperty('PhoneTypeId') && this.userphone.PhoneTypeId !== null ? this.userphone.PhoneTypeId : null,
            'PhoneTypeId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.phonetypes,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
        UserId: new DynamicField(
            this.formGroup,
            'User',
            this.userphone && this.userphone.hasOwnProperty('UserId') && this.userphone.UserId !== null ? this.userphone.UserId : null,
            'UserId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.users,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
    };

    View: IExpandableObject = {
        Extension: new DynamicLabel(
            'Extension',
            this.userphone && this.userphone.hasOwnProperty('Extension') && this.userphone.Extension !== null ? this.userphone.Extension.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        IsPrimary: new DynamicLabel(
            'Is Primary',
            this.userphone && this.userphone.hasOwnProperty('IsPrimary') && this.userphone.IsPrimary !== null ? this.userphone.IsPrimary : false,
            new DynamicFieldType(
                DynamicFieldTypes.Checkbox,
                null,
                null,
            ),
        ),
        Phone: new DynamicLabel(
            'Phone',
            this.userphone && this.userphone.hasOwnProperty('Phone') && this.userphone.Phone !== null ? this.userphone.Phone.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        PhoneTypeId: new DynamicLabel(
            'Phone Type',
            this.getMetaItemValue(this.phonetypes, this.userphone && this.userphone.hasOwnProperty('PhoneTypeId') && this.userphone.PhoneTypeId !== null ? this.userphone.PhoneTypeId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        UserId: new DynamicLabel(
            'User',
            this.getMetaItemValue(this.users, this.userphone && this.userphone.hasOwnProperty('UserId') && this.userphone.UserId !== null ? this.userphone.UserId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
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
        private userphone?: IUserPhone,
        private formGroup = 'UserPhone',
        private phonetypes?: IUser[],
        private users?: IUser[],
    ) { }
}
