import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { ILocation } from '../interfaces/location';
import { IAddress } from '../interfaces/address';
import { IState } from '../interfaces/state';

export class LocationDynamicControls {

    Form: IExpandableObject = {
        AddressId: new DynamicField(
            this.formGroup,
            'Address',
            this.location && this.location.hasOwnProperty('AddressId') && this.location.AddressId !== null ? this.location.AddressId : null,
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
        Archived: new DynamicField(
            this.formGroup,
            'Archived',
            this.location && this.location.hasOwnProperty('Archived') && this.location.Archived !== null ? this.location.Archived : false,
            'Archived',
            new DynamicFieldType(
                DynamicFieldTypes.Checkbox,
                null,
                null,
            ),
            null,
            [ Validators.required ],
            { 'required': true },
        ),
        GoodId: new DynamicField(
            this.formGroup,
            'Goo',
            this.location && this.location.GoodId || null,
            'GoodId',
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                NumericInputTypes.Integer,
                null,
            ),
            null,
            [ Validators.required ],
            { 'required': true },
        ),
        Name: new DynamicField(
            this.formGroup,
            'Name',
            this.location && this.location.hasOwnProperty('Name') && this.location.Name !== null ? this.location.Name.toString() : '',
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
        Quantity: new DynamicField(
            this.formGroup,
            'Quantity',
            this.location && this.location.Quantity || null,
            'Quantity',
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                NumericInputTypes.Integer,
                null,
            ),
            null,
            [ Validators.required ],
            { 'required': true },
        ),
        StateId: new DynamicField(
            this.formGroup,
            'State',
            this.location && this.location.hasOwnProperty('StateId') && this.location.StateId !== null ? this.location.StateId : null,
            'StateId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.states,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
        Total: new DynamicField(
            this.formGroup,
            'Total',
            this.location && this.location.Total || null,
            'Total',
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                null,
                4,
            ),
            null,
            [ Validators.required ],
            { 'required': true },
        ),
    };

    View: IExpandableObject = {
        AddressId: new DynamicLabel(
            'Address',
            this.getMetaItemValue(this.addresses, this.location && this.location.hasOwnProperty('AddressId') && this.location.AddressId !== null ? this.location.AddressId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        Archived: new DynamicLabel(
            'Archived',
            this.location && this.location.hasOwnProperty('Archived') && this.location.Archived !== null ? this.location.Archived : false,
            new DynamicFieldType(
                DynamicFieldTypes.Checkbox,
                null,
                null,
            ),
        ),
        GoodId: new DynamicLabel(
            'Goo',
            this.location && this.location.GoodId || null,
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                NumericInputTypes.Integer,
                null,
            ),
        ),
        Name: new DynamicLabel(
            'Name',
            this.location && this.location.hasOwnProperty('Name') && this.location.Name !== null ? this.location.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        Quantity: new DynamicLabel(
            'Quantity',
            this.location && this.location.Quantity || null,
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                NumericInputTypes.Integer,
                null,
            ),
        ),
        StateId: new DynamicLabel(
            'State',
            this.getMetaItemValue(this.states, this.location && this.location.hasOwnProperty('StateId') && this.location.StateId !== null ? this.location.StateId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        Total: new DynamicLabel(
            'Total',
            this.location && this.location.Total || null,
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                null,
                4,
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
        private location?: ILocation,
        private formGroup = 'Location',
        private addresses?: IAddress[],
        private states?: IState[],
    ) { }
}
