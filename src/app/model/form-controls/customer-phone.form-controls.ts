import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { ICustomerPhone } from '../interfaces/customer-phone';
import { ICustomer } from '../interfaces/customer';
import { IPhoneType } from '../interfaces/phone-type';

export class CustomerPhoneDynamicControls {

    Form: IExpandableObject = {
        CustomerId: new DynamicField(
            this.formGroup,
            'Customer',
            this.customerphone && this.customerphone.hasOwnProperty('CustomerId') && this.customerphone.CustomerId !== null ? this.customerphone.CustomerId : null,
            'CustomerId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.customers,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
        Extension: new DynamicField(
            this.formGroup,
            'Extension',
            this.customerphone && this.customerphone.hasOwnProperty('Extension') && this.customerphone.Extension !== null ? this.customerphone.Extension.toString() : '',
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
            this.customerphone && this.customerphone.hasOwnProperty('IsPrimary') && this.customerphone.IsPrimary !== null ? this.customerphone.IsPrimary : false,
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
            this.customerphone && this.customerphone.hasOwnProperty('Phone') && this.customerphone.Phone !== null ? this.customerphone.Phone.toString() : '',
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
            this.customerphone && this.customerphone.hasOwnProperty('PhoneTypeId') && this.customerphone.PhoneTypeId !== null ? this.customerphone.PhoneTypeId : null,
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
        CustomerId: new DynamicLabel(
            'Customer',
            this.getMetaItemValue(this.customers, this.customerphone && this.customerphone.hasOwnProperty('CustomerId') && this.customerphone.CustomerId !== null ? this.customerphone.CustomerId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        Extension: new DynamicLabel(
            'Extension',
            this.customerphone && this.customerphone.hasOwnProperty('Extension') && this.customerphone.Extension !== null ? this.customerphone.Extension.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        IsPrimary: new DynamicLabel(
            'Is Primary',
            this.customerphone && this.customerphone.hasOwnProperty('IsPrimary') && this.customerphone.IsPrimary !== null ? this.customerphone.IsPrimary : false,
            new DynamicFieldType(
                DynamicFieldTypes.Checkbox,
                null,
                null,
            ),
        ),
        Phone: new DynamicLabel(
            'Phone',
            this.customerphone && this.customerphone.hasOwnProperty('Phone') && this.customerphone.Phone !== null ? this.customerphone.Phone.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        PhoneTypeId: new DynamicLabel(
            'Phone Type',
            this.getMetaItemValue(this.phonetypes, this.customerphone && this.customerphone.hasOwnProperty('PhoneTypeId') && this.customerphone.PhoneTypeId !== null ? this.customerphone.PhoneTypeId : null),
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
        private customerphone?: ICustomerPhone,
        private formGroup = 'CustomerPhone',
        private customers?: ICustomer[],
        private phonetypes?: IPhoneType[],
    ) { }
}
