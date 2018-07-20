import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { ICustomerLocationAddress } from '../interfaces/customer-location-address';
import { ICustomerLocation } from '../interfaces/customer-location';

export class CustomerLocationAddressDynamicControls {

    Form: IExpandableObject = {
        AddressId: new DynamicField(
            this.formGroup,
            'Address',
            this.customerlocationaddress && this.customerlocationaddress.hasOwnProperty('AddressId') && this.customerlocationaddress.AddressId !== null ? this.customerlocationaddress.AddressId : null,
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
        CustomerLocationId: new DynamicField(
            this.formGroup,
            'Customer Location',
            this.customerlocationaddress && this.customerlocationaddress.hasOwnProperty('CustomerLocationId') && this.customerlocationaddress.CustomerLocationId !== null ? this.customerlocationaddress.CustomerLocationId : null,
            'CustomerLocationId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.customerlocations,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
        IsPrimary: new DynamicField(
            this.formGroup,
            'Is Primary',
            this.customerlocationaddress && this.customerlocationaddress.hasOwnProperty('IsPrimary') && this.customerlocationaddress.IsPrimary !== null ? this.customerlocationaddress.IsPrimary : false,
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
            this.getMetaItemValue(this.addresses, this.customerlocationaddress && this.customerlocationaddress.hasOwnProperty('AddressId') && this.customerlocationaddress.AddressId !== null ? this.customerlocationaddress.AddressId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        CustomerLocationId: new DynamicLabel(
            'Customer Location',
            this.getMetaItemValue(this.customerlocations, this.customerlocationaddress && this.customerlocationaddress.hasOwnProperty('CustomerLocationId') && this.customerlocationaddress.CustomerLocationId !== null ? this.customerlocationaddress.CustomerLocationId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        IsPrimary: new DynamicLabel(
            'Is Primary',
            this.customerlocationaddress && this.customerlocationaddress.hasOwnProperty('IsPrimary') && this.customerlocationaddress.IsPrimary !== null ? this.customerlocationaddress.IsPrimary : false,
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
        private customerlocationaddress?: ICustomerLocationAddress,
        private formGroup = 'CustomerLocationAddress',
        private addresses?: ICustomerLocation[],
        private customerlocations?: ICustomerLocation[],
    ) { }
}
