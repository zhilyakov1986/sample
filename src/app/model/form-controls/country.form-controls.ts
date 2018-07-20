import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { ICountry } from '../interfaces/country';

export class CountryDynamicControls {

    Form: IExpandableObject = {
        Alpha3Code: new DynamicField(
            this.formGroup,
            'Alpha3 Code',
            this.country && this.country.hasOwnProperty('Alpha3Code') && this.country.Alpha3Code !== null ? this.country.Alpha3Code.toString() : '',
            'Alpha3Code',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required, Validators.maxLength(3) ],
            { 'required': true, 'maxlength': 3 },
        ),
        CountryCode: new DynamicField(
            this.formGroup,
            'Country Code',
            this.country && this.country.hasOwnProperty('CountryCode') && this.country.CountryCode !== null ? this.country.CountryCode.toString() : '',
            'CountryCode',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required, Validators.maxLength(2) ],
            { 'required': true, 'maxlength': 2 },
        ),
        Name: new DynamicField(
            this.formGroup,
            'Name',
            this.country && this.country.hasOwnProperty('Name') && this.country.Name !== null ? this.country.Name.toString() : '',
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
    };

    View: IExpandableObject = {
        Alpha3Code: new DynamicLabel(
            'Alpha3 Code',
            this.country && this.country.hasOwnProperty('Alpha3Code') && this.country.Alpha3Code !== null ? this.country.Alpha3Code.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        CountryCode: new DynamicLabel(
            'Country Code',
            this.country && this.country.hasOwnProperty('CountryCode') && this.country.CountryCode !== null ? this.country.CountryCode.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        Name: new DynamicLabel(
            'Name',
            this.country && this.country.hasOwnProperty('Name') && this.country.Name !== null ? this.country.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
    };

    constructor(
        private country?: ICountry,
        private formGroup = 'Country',
    ) { }
}
