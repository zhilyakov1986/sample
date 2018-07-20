import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IGood } from '../interfaces/good';
import { IServiceDivision } from '../interfaces/service-division';
import { IServiceType } from '../interfaces/service-type';
import { IUnitType } from '../interfaces/unit-type';

export class GoodDynamicControls {

    Form: IExpandableObject = {
        Archived: new DynamicField(
            this.formGroup,
            'Archived',
            this.good && this.good.hasOwnProperty('Archived') && this.good.Archived !== null ? this.good.Archived : false,
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
        Cost: new DynamicField(
            this.formGroup,
            'Cost',
            this.good && this.good.Cost || null,
            'Cost',
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                null,
                4,
            ),
            null,
            [ Validators.required ],
            { 'required': true },
        ),
        Name: new DynamicField(
            this.formGroup,
            'Name',
            this.good && this.good.hasOwnProperty('Name') && this.good.Name !== null ? this.good.Name.toString() : '',
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
        Price: new DynamicField(
            this.formGroup,
            'Price',
            this.good && this.good.Price || null,
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
        ServiceDivisionId: new DynamicField(
            this.formGroup,
            'Service Division',
            this.good && this.good.hasOwnProperty('ServiceDivisionId') && this.good.ServiceDivisionId !== null ? this.good.ServiceDivisionId : null,
            'ServiceDivisionId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.servicedivisions,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
        ServiceLongDescription: new DynamicField(
            this.formGroup,
            'Service Long Description',
            this.good && this.good.hasOwnProperty('ServiceLongDescription') && this.good.ServiceLongDescription !== null ? this.good.ServiceLongDescription.toString() : '',
            'ServiceLongDescription',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required ],
            { 'required': true },
        ),
        ServiceShortDescription: new DynamicField(
            this.formGroup,
            'Service Short Description',
            this.good && this.good.hasOwnProperty('ServiceShortDescription') && this.good.ServiceShortDescription !== null ? this.good.ServiceShortDescription.toString() : '',
            'ServiceShortDescription',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.required, Validators.maxLength(250) ],
            { 'required': true, 'maxlength': 250 },
        ),
        ServiceTypeId: new DynamicField(
            this.formGroup,
            'Service Type',
            this.good && this.good.hasOwnProperty('ServiceTypeId') && this.good.ServiceTypeId !== null ? this.good.ServiceTypeId : null,
            'ServiceTypeId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.servicetypes,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
        Taxable: new DynamicField(
            this.formGroup,
            'Taxable',
            this.good && this.good.hasOwnProperty('Taxable') && this.good.Taxable !== null ? this.good.Taxable : false,
            'Taxable',
            new DynamicFieldType(
                DynamicFieldTypes.Checkbox,
                null,
                null,
            ),
            null,
            [ Validators.required ],
            { 'required': true },
        ),
        UnitTypeId: new DynamicField(
            this.formGroup,
            'Unit Type',
            this.good && this.good.hasOwnProperty('UnitTypeId') && this.good.UnitTypeId !== null ? this.good.UnitTypeId : null,
            'UnitTypeId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.unittypes,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
    };

    View: IExpandableObject = {
        Archived: new DynamicLabel(
            'Archived',
            this.good && this.good.hasOwnProperty('Archived') && this.good.Archived !== null ? this.good.Archived : false,
            new DynamicFieldType(
                DynamicFieldTypes.Checkbox,
                null,
                null,
            ),
        ),
        Cost: new DynamicLabel(
            'Cost',
            this.good && this.good.Cost || null,
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                null,
                4,
            ),
        ),
        Name: new DynamicLabel(
            'Name',
            this.good && this.good.hasOwnProperty('Name') && this.good.Name !== null ? this.good.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        Price: new DynamicLabel(
            'Price',
            this.good && this.good.Price || null,
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                null,
                4,
            ),
        ),
        ServiceDivisionId: new DynamicLabel(
            'Service Division',
            this.getMetaItemValue(this.servicedivisions, this.good && this.good.hasOwnProperty('ServiceDivisionId') && this.good.ServiceDivisionId !== null ? this.good.ServiceDivisionId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        ServiceLongDescription: new DynamicLabel(
            'Service Long Description',
            this.good && this.good.hasOwnProperty('ServiceLongDescription') && this.good.ServiceLongDescription !== null ? this.good.ServiceLongDescription.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        ServiceShortDescription: new DynamicLabel(
            'Service Short Description',
            this.good && this.good.hasOwnProperty('ServiceShortDescription') && this.good.ServiceShortDescription !== null ? this.good.ServiceShortDescription.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        ServiceTypeId: new DynamicLabel(
            'Service Type',
            this.getMetaItemValue(this.servicetypes, this.good && this.good.hasOwnProperty('ServiceTypeId') && this.good.ServiceTypeId !== null ? this.good.ServiceTypeId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        Taxable: new DynamicLabel(
            'Taxable',
            this.good && this.good.hasOwnProperty('Taxable') && this.good.Taxable !== null ? this.good.Taxable : false,
            new DynamicFieldType(
                DynamicFieldTypes.Checkbox,
                null,
                null,
            ),
        ),
        UnitTypeId: new DynamicLabel(
            'Unit Type',
            this.getMetaItemValue(this.unittypes, this.good && this.good.hasOwnProperty('UnitTypeId') && this.good.UnitTypeId !== null ? this.good.UnitTypeId : null),
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
        private good?: IGood,
        private formGroup = 'Good',
        private servicedivisions?: IServiceDivision[],
        private servicetypes?: IServiceType[],
        private unittypes?: IUnitType[],
    ) { }
}
