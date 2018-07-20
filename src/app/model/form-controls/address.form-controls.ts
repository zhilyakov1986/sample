import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IAddress } from '../interfaces/address';
import { IState } from '../interfaces/state';

export class AddressDynamicControls {

    Form: IExpandableObject = {
        Address1: new DynamicField(
            this.formGroup,
            'Address1',
            this.address && this.address.hasOwnProperty('Address1') && this.address.Address1 !== null ? this.address.Address1.toString() : '',
            'Address1',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.maxLength(50) ],
            { 'maxlength': 50 },
        ),
        Address2: new DynamicField(
            this.formGroup,
            'Address2',
            this.address && this.address.hasOwnProperty('Address2') && this.address.Address2 !== null ? this.address.Address2.toString() : '',
            'Address2',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.maxLength(50) ],
            { 'maxlength': 50 },
        ),
        City: new DynamicField(
            this.formGroup,
            'City',
            this.address && this.address.hasOwnProperty('City') && this.address.City !== null ? this.address.City.toString() : '',
            'City',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.maxLength(50) ],
            { 'maxlength': 50 },
        ),
        CountryCode: new DynamicField(
            this.formGroup,
            'Country Code',
            this.address && this.address.hasOwnProperty('CountryCode') && this.address.CountryCode !== null ? this.address.CountryCode.toString() : '',
            'CountryCode',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.maxLength(2) ],
            { 'maxlength': 2 },
        ),
        Province: new DynamicField(
            this.formGroup,
            'Province',
            this.address && this.address.hasOwnProperty('Province') && this.address.Province !== null ? this.address.Province.toString() : '',
            'Province',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.maxLength(50) ],
            { 'maxlength': 50 },
        ),
        StateId: new DynamicField(
            this.formGroup,
            'State',
            this.address && this.address.hasOwnProperty('StateId') && this.address.StateId !== null ? this.address.StateId : null,
            'StateId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.states,
            [  ],
            {  },
        ),
        Zip: new DynamicField(
            this.formGroup,
            'Zip',
            this.address && this.address.hasOwnProperty('Zip') && this.address.Zip !== null ? this.address.Zip.toString() : '',
            'Zip',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.maxLength(20) ],
            { 'maxlength': 20 },
        ),
    };

    View: IExpandableObject = {
        Address1: new DynamicLabel(
            'Address1',
            this.address && this.address.hasOwnProperty('Address1') && this.address.Address1 !== null ? this.address.Address1.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        Address2: new DynamicLabel(
            'Address2',
            this.address && this.address.hasOwnProperty('Address2') && this.address.Address2 !== null ? this.address.Address2.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        City: new DynamicLabel(
            'City',
            this.address && this.address.hasOwnProperty('City') && this.address.City !== null ? this.address.City.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        CountryCode: new DynamicLabel(
            'Country Code',
            this.address && this.address.hasOwnProperty('CountryCode') && this.address.CountryCode !== null ? this.address.CountryCode.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        Province: new DynamicLabel(
            'Province',
            this.address && this.address.hasOwnProperty('Province') && this.address.Province !== null ? this.address.Province.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        StateId: new DynamicLabel(
            'State',
            this.getMetaItemValue(this.states, this.address && this.address.hasOwnProperty('StateId') && this.address.StateId !== null ? this.address.StateId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        Zip: new DynamicLabel(
            'Zip',
            this.address && this.address.hasOwnProperty('Zip') && this.address.Zip !== null ? this.address.Zip.toString() : '',
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
        private address?: IAddress,
        private formGroup = 'Address',
        private states?: IState[],
    ) { }
}
