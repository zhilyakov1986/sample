import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { ICustomerAddress } from '../interfaces/customer-address';
import { ICustomer } from '../interfaces/customer';

export class CustomerAddressDynamicControls {

    Form: IExpandableObject = {
        AddressId: new DynamicField(
            this.formGroup,
            'Address',
            this.customeraddress && this.customeraddress.hasOwnProperty('AddressId') && this.customeraddress.AddressId !== null ? this.customeraddress.AddressId : null,
            'AddressId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.addresses,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
        CustomerId: new DynamicField(
            this.formGroup,
            'Customer',
            this.customeraddress && this.customeraddress.hasOwnProperty('CustomerId') && this.customeraddress.CustomerId !== null ? this.customeraddress.CustomerId : null,
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
        IsPrimary: new DynamicField(
            this.formGroup,
            'Is Primary',
            this.customeraddress && this.customeraddress.hasOwnProperty('IsPrimary') && this.customeraddress.IsPrimary !== null ? this.customeraddress.IsPrimary : false,
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
    };

    View: IExpandableObject = {
        AddressId: new DynamicLabel(
            'Address',
            this.getMetaItemValue(this.addresses, this.customeraddress && this.customeraddress.hasOwnProperty('AddressId') && this.customeraddress.AddressId !== null ? this.customeraddress.AddressId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        CustomerId: new DynamicLabel(
            'Customer',
            this.getMetaItemValue(this.customers, this.customeraddress && this.customeraddress.hasOwnProperty('CustomerId') && this.customeraddress.CustomerId !== null ? this.customeraddress.CustomerId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        IsPrimary: new DynamicLabel(
            'Is Primary',
            this.customeraddress && this.customeraddress.hasOwnProperty('IsPrimary') && this.customeraddress.IsPrimary !== null ? this.customeraddress.IsPrimary : false,
            new DynamicFieldType(
                DynamicFieldTypes.Checkbox,
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
        private customeraddress?: ICustomerAddress,
        private formGroup = 'CustomerAddress',
        private addresses?: ICustomer[],
        private customers?: ICustomer[],
    ) { }
}
