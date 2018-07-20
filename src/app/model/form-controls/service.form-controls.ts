import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IService } from '../interfaces/service';
import { IServiceLongDescription } from '../interfaces/service-long-description';
import { IServiceShortDescription } from '../interfaces/service-short-description';
import { IServiceType } from '../interfaces/service-type';

export class ServiceDynamicControls {

    Form: IExpandableObject = {
        Cost: new DynamicField(
            this.formGroup,
            'Cost',
            this.service && this.service.Cost || null,
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
            this.service && this.service.hasOwnProperty('Name') && this.service.Name !== null ? this.service.Name.toString() : '',
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
            this.service && this.service.Price || null,
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
            this.service && this.service.ServiceDivisionId || null,
            'ServiceDivisionId',
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                NumericInputTypes.Integer,
                null,
            ),
            null,
            [ Validators.required ],
            { 'required': true },
        ),
        ServiceLongDescriptionId: new DynamicField(
            this.formGroup,
            'Service Long Description',
            this.service && this.service.hasOwnProperty('ServiceLongDescriptionId') && this.service.ServiceLongDescriptionId !== null ? this.service.ServiceLongDescriptionId : null,
            'ServiceLongDescriptionId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.servicelongdescriptions,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
        ServiceShortDescriptionId: new DynamicField(
            this.formGroup,
            'Service Short Description',
            this.service && this.service.hasOwnProperty('ServiceShortDescriptionId') && this.service.ServiceShortDescriptionId !== null ? this.service.ServiceShortDescriptionId : null,
            'ServiceShortDescriptionId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.serviceshortdescriptions,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
        ServiceTypeId: new DynamicField(
            this.formGroup,
            'Service Type',
            this.service && this.service.hasOwnProperty('ServiceTypeId') && this.service.ServiceTypeId !== null ? this.service.ServiceTypeId : null,
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
            this.service && this.service.hasOwnProperty('Taxable') && this.service.Taxable !== null ? this.service.Taxable : false,
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
            this.service && this.service.UnitTypeId || null,
            'UnitTypeId',
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                NumericInputTypes.Integer,
                null,
            ),
            null,
            [ Validators.required ],
            { 'required': true },
        ),
    };

    View: IExpandableObject = {
        Cost: new DynamicLabel(
            'Cost',
            this.service && this.service.Cost || null,
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                null,
                4,
            ),
        ),
        Name: new DynamicLabel(
            'Name',
            this.service && this.service.hasOwnProperty('Name') && this.service.Name !== null ? this.service.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        Price: new DynamicLabel(
            'Price',
            this.service && this.service.Price || null,
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                null,
                4,
            ),
        ),
        ServiceDivisionId: new DynamicLabel(
            'Service Division',
            this.service && this.service.ServiceDivisionId || null,
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                NumericInputTypes.Integer,
                null,
            ),
        ),
        ServiceLongDescriptionId: new DynamicLabel(
            'Service Long Description',
            this.getMetaItemValue(this.servicelongdescriptions, this.service && this.service.hasOwnProperty('ServiceLongDescriptionId') && this.service.ServiceLongDescriptionId !== null ? this.service.ServiceLongDescriptionId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        ServiceShortDescriptionId: new DynamicLabel(
            'Service Short Description',
            this.getMetaItemValue(this.serviceshortdescriptions, this.service && this.service.hasOwnProperty('ServiceShortDescriptionId') && this.service.ServiceShortDescriptionId !== null ? this.service.ServiceShortDescriptionId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        ServiceTypeId: new DynamicLabel(
            'Service Type',
            this.getMetaItemValue(this.servicetypes, this.service && this.service.hasOwnProperty('ServiceTypeId') && this.service.ServiceTypeId !== null ? this.service.ServiceTypeId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        Taxable: new DynamicLabel(
            'Taxable',
            this.service && this.service.hasOwnProperty('Taxable') && this.service.Taxable !== null ? this.service.Taxable : false,
            new DynamicFieldType(
                DynamicFieldTypes.Checkbox,
                null,
                null,
            ),
        ),
        UnitTypeId: new DynamicLabel(
            'Unit Type',
            this.service && this.service.UnitTypeId || null,
            new DynamicFieldType(
                DynamicFieldTypes.Numeric,
                NumericInputTypes.Integer,
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
        private service?: IService,
        private formGroup = 'Service',
        private servicelongdescriptions?: IServiceLongDescription[],
        private serviceshortdescriptions?: IServiceShortDescription[],
        private servicetypes?: IServiceType[],
    ) { }
}
