import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IContact } from '../interfaces/contact';
import { IAddress } from '../interfaces/address';
import { IContactStatus } from '../interfaces/contact-status';

export class ContactDynamicControls {

    Form: IExpandableObject = {
        AddressId: new DynamicField(
            this.formGroup,
            'Address',
            this.contact && this.contact.hasOwnProperty('AddressId') && this.contact.AddressId !== null ? this.contact.AddressId : null,
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
        Email: new DynamicField(
            this.formGroup,
            'Email',
            this.contact && this.contact.hasOwnProperty('Email') && this.contact.Email !== null ? this.contact.Email.toString() : '',
            'Email',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.maxLength(50), Validators.email ],
            { 'maxlength': 50, 'email': true },
        ),
        FirstName: new DynamicField(
            this.formGroup,
            'First Name',
            this.contact && this.contact.hasOwnProperty('FirstName') && this.contact.FirstName !== null ? this.contact.FirstName.toString() : '',
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
        LastName: new DynamicField(
            this.formGroup,
            'Last Name',
            this.contact && this.contact.hasOwnProperty('LastName') && this.contact.LastName !== null ? this.contact.LastName.toString() : '',
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
        StatusId: new DynamicField(
            this.formGroup,
            'Status',
            this.contact && this.contact.hasOwnProperty('StatusId') && this.contact.StatusId !== null ? this.contact.StatusId : null,
            'StatusId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.statuses,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
        Title: new DynamicField(
            this.formGroup,
            'Title',
            this.contact && this.contact.hasOwnProperty('Title') && this.contact.Title !== null ? this.contact.Title.toString() : '',
            'Title',
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
        AddressId: new DynamicLabel(
            'Address',
            this.getMetaItemValue(this.addresses, this.contact && this.contact.hasOwnProperty('AddressId') && this.contact.AddressId !== null ? this.contact.AddressId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        Email: new DynamicLabel(
            'Email',
            this.contact && this.contact.hasOwnProperty('Email') && this.contact.Email !== null ? this.contact.Email.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        FirstName: new DynamicLabel(
            'First Name',
            this.contact && this.contact.hasOwnProperty('FirstName') && this.contact.FirstName !== null ? this.contact.FirstName.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        LastName: new DynamicLabel(
            'Last Name',
            this.contact && this.contact.hasOwnProperty('LastName') && this.contact.LastName !== null ? this.contact.LastName.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        StatusId: new DynamicLabel(
            'Status',
            this.getMetaItemValue(this.statuses, this.contact && this.contact.hasOwnProperty('StatusId') && this.contact.StatusId !== null ? this.contact.StatusId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        Title: new DynamicLabel(
            'Title',
            this.contact && this.contact.hasOwnProperty('Title') && this.contact.Title !== null ? this.contact.Title.toString() : '',
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
        private contact?: IContact,
        private formGroup = 'Contact',
        private addresses?: IAddress[],
        private statuses?: IContactStatus[],
    ) { }
}
