import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IWorkOrderStatus } from '../interfaces/work-order-status';

export class WorkOrderStatusDynamicControls {

    Form: IExpandableObject = {
        Name: new DynamicField(
            this.formGroup,
            'Name',
            this.workorderstatus && this.workorderstatus.hasOwnProperty('Name') && this.workorderstatus.Name !== null ? this.workorderstatus.Name.toString() : '',
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
        Name: new DynamicLabel(
            'Name',
            this.workorderstatus && this.workorderstatus.hasOwnProperty('Name') && this.workorderstatus.Name !== null ? this.workorderstatus.Name.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
    };

    constructor(
        private workorderstatus?: IWorkOrderStatus,
        private formGroup = 'WorkOrderStatus',
    ) { }
}
