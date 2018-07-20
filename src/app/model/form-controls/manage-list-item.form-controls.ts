import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IManageListItem } from '../interfaces/manage-list-item';
import { IServiceArea } from '../interfaces/service-area';
import { IServiceDivision } from '../interfaces/service-division';
import { IUnitType } from '../interfaces/unit-type';

export class ManageListItemDynamicControls {

    Form: IExpandableObject = {
        ServiceAreaId: new DynamicField(
            this.formGroup,
            'Service Area',
            this.managelistitem && this.managelistitem.hasOwnProperty('ServiceAreaId') && this.managelistitem.ServiceAreaId !== null ? this.managelistitem.ServiceAreaId : null,
            'ServiceAreaId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.serviceareas,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
        ServiceDivisionId: new DynamicField(
            this.formGroup,
            'Service Division',
            this.managelistitem && this.managelistitem.hasOwnProperty('ServiceDivisionId') && this.managelistitem.ServiceDivisionId !== null ? this.managelistitem.ServiceDivisionId : null,
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
        UnitTypeId: new DynamicField(
            this.formGroup,
            'Unit Type',
            this.managelistitem && this.managelistitem.hasOwnProperty('UnitTypeId') && this.managelistitem.UnitTypeId !== null ? this.managelistitem.UnitTypeId : null,
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
        ServiceAreaId: new DynamicLabel(
            'Service Area',
            this.getMetaItemValue(this.serviceareas, this.managelistitem && this.managelistitem.hasOwnProperty('ServiceAreaId') && this.managelistitem.ServiceAreaId !== null ? this.managelistitem.ServiceAreaId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        ServiceDivisionId: new DynamicLabel(
            'Service Division',
            this.getMetaItemValue(this.servicedivisions, this.managelistitem && this.managelistitem.hasOwnProperty('ServiceDivisionId') && this.managelistitem.ServiceDivisionId !== null ? this.managelistitem.ServiceDivisionId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        UnitTypeId: new DynamicLabel(
            'Unit Type',
            this.getMetaItemValue(this.unittypes, this.managelistitem && this.managelistitem.hasOwnProperty('UnitTypeId') && this.managelistitem.UnitTypeId !== null ? this.managelistitem.UnitTypeId : null),
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
        private managelistitem?: IManageListItem,
        private formGroup = 'ManageListItem',
        private serviceareas?: IServiceArea[],
        private servicedivisions?: IServiceDivision[],
        private unittypes?: IUnitType[],
    ) { }
}
