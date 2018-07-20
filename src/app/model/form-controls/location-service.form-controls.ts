import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { ILocationService } from '../interfaces/location-service';
import { IContract } from '../interfaces/contract';
import { ICustomerLocation } from '../interfaces/customer-location';

export class LocationServiceDynamicControls {

    Form: IExpandableObject = {
        Archived: new DynamicField(
            this.formGroup,
            'Archived',
            this.locationservice && this.locationservice.hasOwnProperty('Archived') && this.locationservice.Archived !== null ? this.locationservice.Archived : false,
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
        ContractId: new DynamicField(
            this.formGroup,
            'Contract',
            this.locationservice && this.locationservice.hasOwnProperty('ContractId') && this.locationservice.ContractId !== null ? this.locationservice.ContractId : null,
            'ContractId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.contracts,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
        CustomerLocationId: new DynamicField(
            this.formGroup,
            'Customer Location',
            this.locationservice && this.locationservice.hasOwnProperty('CustomerLocationId') && this.locationservice.CustomerLocationId !== null ? this.locationservice.CustomerLocationId : null,
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
        GoodId: new DynamicField(
            this.formGroup,
            'Goo',
            this.locationservice && this.locationservice.GoodId || null,
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
        LongDescription: new DynamicField(
            this.formGroup,
            'Long Description',
            this.locationservice && this.locationservice.hasOwnProperty('LongDescription') && this.locationservice.LongDescription !== null ? this.locationservice.LongDescription.toString() : '',
            'LongDescription',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required ],
            { 'required': true },
        ),
        Price: new DynamicField(
            this.formGroup,
            'Price',
            this.locationservice && this.locationservice.Price || null,
            'Price',
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                null,
                4,
            ),
            null,
            [ Validators.required ],
            { 'required': true },
        ),
        Quantity: new DynamicField(
            this.formGroup,
            'Quantity',
            this.locationservice && this.locationservice.Quantity || null,
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
        ShortDescription: new DynamicField(
            this.formGroup,
            'Short Description',
            this.locationservice && this.locationservice.hasOwnProperty('ShortDescription') && this.locationservice.ShortDescription !== null ? this.locationservice.ShortDescription.toString() : '',
            'ShortDescription',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required, Validators.maxLength(250) ],
            { 'required': true, 'maxlength': 250 },
        ),
    };

    View: IExpandableObject = {
        Archived: new DynamicLabel(
            'Archived',
            this.locationservice && this.locationservice.hasOwnProperty('Archived') && this.locationservice.Archived !== null ? this.locationservice.Archived : false,
            new DynamicFieldType(
                DynamicFieldTypes.Checkbox,
                null,
                null,
            ),
        ),
        ContractId: new DynamicLabel(
            'Contract',
            this.getMetaItemValue(this.contracts, this.locationservice && this.locationservice.hasOwnProperty('ContractId') && this.locationservice.ContractId !== null ? this.locationservice.ContractId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        CustomerLocationId: new DynamicLabel(
            'Customer Location',
            this.getMetaItemValue(this.customerlocations, this.locationservice && this.locationservice.hasOwnProperty('CustomerLocationId') && this.locationservice.CustomerLocationId !== null ? this.locationservice.CustomerLocationId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        GoodId: new DynamicLabel(
            'Goo',
            this.locationservice && this.locationservice.GoodId || null,
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                NumericInputTypes.Integer,
                null,
            ),
        ),
        LongDescription: new DynamicLabel(
            'Long Description',
            this.locationservice && this.locationservice.hasOwnProperty('LongDescription') && this.locationservice.LongDescription !== null ? this.locationservice.LongDescription.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        Price: new DynamicLabel(
            'Price',
            this.locationservice && this.locationservice.Price || null,
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                null,
                4,
            ),
        ),
        Quantity: new DynamicLabel(
            'Quantity',
            this.locationservice && this.locationservice.Quantity || null,
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                NumericInputTypes.Integer,
                null,
            ),
        ),
        ShortDescription: new DynamicLabel(
            'Short Description',
            this.locationservice && this.locationservice.hasOwnProperty('ShortDescription') && this.locationservice.ShortDescription !== null ? this.locationservice.ShortDescription.toString() : '',
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
        private locationservice?: ILocationService,
        private formGroup = 'LocationService',
        private contracts?: IContract[],
        private customerlocations?: ICustomerLocation[],
    ) { }
}
