import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { ICustomer } from '../interfaces/customer';
import { ICustomerSource } from '../interfaces/customer-source';
import { ICustomerStatus } from '../interfaces/customer-status';

export class CustomerDynamicControls {

    Form: IExpandableObject = {
        Name: new DynamicField(
            this.formGroup,
            'Name',
            this.customer && this.customer.hasOwnProperty('Name') && this.customer.Name !== null ? this.customer.Name.toString() : '',
            'Name',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required, Validators.maxLength(50) ],
            { 'required': true, 'maxlength': 50 },
        ),
        SourceId: new DynamicField(
            this.formGroup,
            'Source',
            this.customer && this.customer.hasOwnProperty('SourceId') && this.customer.SourceId !== null ? this.customer.SourceId : null,
            'SourceId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.sources,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
        StatusId: new DynamicField(
            this.formGroup,
            'Status',
            this.customer && this.customer.hasOwnProperty('StatusId') && this.customer.StatusId !== null ? this.customer.StatusId : null,
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
    };

    View: IExpandableObject = {
        Name: new DynamicLabel(
            'Name',
            this.customer && this.customer.hasOwnProperty('Name') && this.customer.Name !== null ? this.customer.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        SourceId: new DynamicLabel(
            'Source',
            this.getMetaItemValue(this.sources, this.customer && this.customer.hasOwnProperty('SourceId') && this.customer.SourceId !== null ? this.customer.SourceId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        StatusId: new DynamicLabel(
            'Status',
            this.getMetaItemValue(this.statuses, this.customer && this.customer.hasOwnProperty('StatusId') && this.customer.StatusId !== null ? this.customer.StatusId : null),
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
        private customer?: ICustomer,
        private formGroup = 'Customer',
        private sources?: ICustomerSource[],
        private statuses?: ICustomerStatus[],
    ) { }
}
