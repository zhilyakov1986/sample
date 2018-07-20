import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IContactPhone } from '../interfaces/contact-phone';
import { IContact } from '../interfaces/contact';
import { IPhoneType } from '../interfaces/phone-type';

export class ContactPhoneDynamicControls {

    Form: IExpandableObject = {
        ContactId: new DynamicField(
            this.formGroup,
            'Contact',
            this.contactphone && this.contactphone.hasOwnProperty('ContactId') && this.contactphone.ContactId !== null ? this.contactphone.ContactId : null,
            'ContactId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.contacts,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
        Extension: new DynamicField(
            this.formGroup,
            'Extension',
            this.contactphone && this.contactphone.hasOwnProperty('Extension') && this.contactphone.Extension !== null ? this.contactphone.Extension.toString() : '',
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
            this.contactphone && this.contactphone.hasOwnProperty('IsPrimary') && this.contactphone.IsPrimary !== null ? this.contactphone.IsPrimary : false,
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
            this.contactphone && this.contactphone.hasOwnProperty('Phone') && this.contactphone.Phone !== null ? this.contactphone.Phone.toString() : '',
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
            this.contactphone && this.contactphone.hasOwnProperty('PhoneTypeId') && this.contactphone.PhoneTypeId !== null ? this.contactphone.PhoneTypeId : null,
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
    };

    View: IExpandableObject = {
        ContactId: new DynamicLabel(
            'Contact',
            this.getMetaItemValue(this.contacts, this.contactphone && this.contactphone.hasOwnProperty('ContactId') && this.contactphone.ContactId !== null ? this.contactphone.ContactId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        Extension: new DynamicLabel(
            'Extension',
            this.contactphone && this.contactphone.hasOwnProperty('Extension') && this.contactphone.Extension !== null ? this.contactphone.Extension.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        IsPrimary: new DynamicLabel(
            'Is Primary',
            this.contactphone && this.contactphone.hasOwnProperty('IsPrimary') && this.contactphone.IsPrimary !== null ? this.contactphone.IsPrimary : false,
            new DynamicFieldType(
                DynamicFieldTypes.Checkbox,
                null,
                null,
            ),
        ),
        Phone: new DynamicLabel(
            'Phone',
            this.contactphone && this.contactphone.hasOwnProperty('Phone') && this.contactphone.Phone !== null ? this.contactphone.Phone.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        PhoneTypeId: new DynamicLabel(
            'Phone Type',
            this.getMetaItemValue(this.phonetypes, this.contactphone && this.contactphone.hasOwnProperty('PhoneTypeId') && this.contactphone.PhoneTypeId !== null ? this.contactphone.PhoneTypeId : null),
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
        private contactphone?: IContactPhone,
        private formGroup = 'ContactPhone',
        private contacts?: IContact[],
        private phonetypes?: IPhoneType[],
    ) { }
}
