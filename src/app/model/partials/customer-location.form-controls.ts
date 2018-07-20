import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import {
    DynamicField,
    DynamicFieldType,
    DynamicFieldTypes,
    DynamicLabel,
    noZeroRequiredValidator,
    InputTypes,
    NumericInputTypes,
    SelectInputTypes,
} from '@mt-ng2/dynamic-form';

import { ICustomerLocation } from '../interfaces/customer-location';
import { IServiceArea } from '../interfaces/service-area';
import { ICustomer } from '../interfaces/customer';
import { IMetaItem } from '../interfaces/base';

export class CustomerLocationDynamicControlsPartial {
    Form: IExpandableObject = {
        Archived: new DynamicField(
            this.formGroup,
            'Archived',
            this.customerlocation &&
            this.customerlocation.hasOwnProperty('Archived') &&
            this.customerlocation.Archived !== null
                ? this.customerlocation.Archived
                : false,
            'Archived',
            new DynamicFieldType(DynamicFieldTypes.Checkbox, null, null),
            null,
            [Validators.required],
            { required: true },
        ),
        CustomerId: new DynamicField(
            this.formGroup,
            'Customer Name',
            this.customerlocation &&
            this.customerlocation.hasOwnProperty('CustomerId') &&
            this.customerlocation.CustomerId !== null
                ? this.customerlocation.CustomerId
                : null,
            'CustomerId',
            new DynamicFieldType(DynamicFieldTypes.Select, null, null),
            this.customer,
            [noZeroRequiredValidator],
            { required: true },
        ),
        Name: new DynamicField(
            this.formGroup,
            'Customer Location Name',
            this.customerlocation &&
            this.customerlocation.hasOwnProperty('Name') &&
            this.customerlocation.Name !== null
                ? this.customerlocation.Name.toString()
                : '',
            'Name',
            new DynamicFieldType(DynamicFieldTypes.Input, null, null),
            null,
            [Validators.required, Validators.maxLength(50)],
            { required: true, maxlength: 50 },
        ),
        ServiceAreaId: new DynamicField(
            this.formGroup,
            'Service Area',
            this.customerlocation &&
            this.customerlocation.hasOwnProperty('ServiceAreaId') &&
            this.customerlocation.ServiceAreaId !== null
                ? this.customerlocation.ServiceAreaId
                : null,
            'ServiceAreaId',
            new DynamicFieldType(DynamicFieldTypes.Select, null, null),
            this.serviceareas,
            [noZeroRequiredValidator],
            { required: true },
        ),
    };

    View: IExpandableObject = {
        Archived: new DynamicLabel(
            'Archived',
            this.customerlocation &&
            this.customerlocation.hasOwnProperty('Archived') &&
            this.customerlocation.Archived !== null
                ? this.customerlocation.Archived
                : false,
            new DynamicFieldType(DynamicFieldTypes.Checkbox, null, null),
        ),
        CustomerId: new DynamicLabel(
            'Customer Name',
            this.getMetaItemValue(
                this.customer,
                this.customerlocation &&
                this.customerlocation.hasOwnProperty('CustomerId') &&
                this.customerlocation.CustomerId !== null
                    ? this.customerlocation.CustomerId
                    : null,
            ),
            new DynamicFieldType(DynamicFieldTypes.Input, null, null),
        ),
        Name: new DynamicLabel(
            'Customer Location Name',
            this.customerlocation &&
            this.customerlocation.hasOwnProperty('Name') &&
            this.customerlocation.Name !== null
                ? this.customerlocation.Name.toString()
                : '',
            new DynamicFieldType(DynamicFieldTypes.Input, null, null),
        ),
        ServiceAreaId: new DynamicLabel(
            'Service Area',
            this.getMetaItemValue(
                this.serviceareas,
                this.customerlocation &&
                this.customerlocation.hasOwnProperty('ServiceAreaId') &&
                this.customerlocation.ServiceAreaId !== null
                    ? this.customerlocation.ServiceAreaId
                    : null,
            ),
            new DynamicFieldType(DynamicFieldTypes.Select, null, null),
        ),
    };

    protected getMetaItemValue(source, id: number | number[]): string {
        if (!source) {
            return undefined;
        }
        if (id instanceof Array) {
            const items = source
                .filter((s) => (<number[]>id).some((id) => s.Id === id))
                .map((s) => s.Name);
            return (items && items.join(', ')) || undefined;
        }
        const item = source.find((s) => s.Id === id);
        return (item && item.Name) || undefined;
    }
    constructor(
        private customerlocation?: ICustomerLocation,
        private formGroup = 'CustomerLocation',
        private customer?: IMetaItem[],
        private serviceareas?: IServiceArea[],
    ) {}
}
