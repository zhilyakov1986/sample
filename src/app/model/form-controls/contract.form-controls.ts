import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, noZeroRequiredValidator, InputTypes, NumericInputTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';

import { IContract } from '../interfaces/contract';
import { ICustomer } from '../interfaces/customer';
import { IServiceDivision } from '../interfaces/service-division';
import { IContractStatus } from '../interfaces/contract-status';
import { IUser } from '../interfaces/user';

export class ContractDynamicControls {

    Form: IExpandableObject = {
        Archived: new DynamicField(
            this.formGroup,
            'Archived',
            this.contract && this.contract.hasOwnProperty('Archived') && this.contract.Archived !== null ? this.contract.Archived : false,
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
        CustomerId: new DynamicField(
            this.formGroup,
            'Customer',
            this.contract && this.contract.hasOwnProperty('CustomerId') && this.contract.CustomerId !== null ? this.contract.CustomerId : null,
            'CustomerId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.customers,
            [ noZeroRequiredValidator ],
            { 'required': true },
        ),
        EndDate: new DynamicField(
            this.formGroup,
            'End Date',
            this.contract && this.contract.EndDate || null,
            'EndDate',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                InputTypes.Datepicker,
                null,
            ),
            null,
            [ Validators.required ],
            { 'required': true },
        ),
        Number: new DynamicField(
            this.formGroup,
            'Number',
            this.contract && this.contract.hasOwnProperty('Number') && this.contract.Number !== null ? this.contract.Number.toString() : '',
            'Number',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
            null,
            [ Validators.maxLength(50) ],
            { 'maxlength': 50 },
        ),
        ServiceDivisionId: new DynamicField(
            this.formGroup,
            'Service Division',
            this.contract && this.contract.hasOwnProperty('ServiceDivisionId') && this.contract.ServiceDivisionId !== null ? this.contract.ServiceDivisionId : null,
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
        StartDate: new DynamicField(
            this.formGroup,
            'Start Date',
            this.contract && this.contract.StartDate || null,
            'StartDate',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                InputTypes.Datepicker,
                null,
            ),
            null,
            [ Validators.required ],
            { 'required': true },
        ),
        StatusId: new DynamicField(
            this.formGroup,
            'Status',
            this.contract && this.contract.hasOwnProperty('StatusId') && this.contract.StatusId !== null ? this.contract.StatusId : null,
            'StatusId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.statuses,
            [  ],
            {  },
        ),
        UserId: new DynamicField(
            this.formGroup,
            'User',
            this.contract && this.contract.hasOwnProperty('UserId') && this.contract.UserId !== null ? this.contract.UserId : null,
            'UserId',
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
            this.users,
            [  ],
            {  },
        ),
    };

    View: IExpandableObject = {
        Archived: new DynamicLabel(
            'Archived',
            this.contract && this.contract.hasOwnProperty('Archived') && this.contract.Archived !== null ? this.contract.Archived : false,
            new DynamicFieldType(
                DynamicFieldTypes.Checkbox,
                null,
                null,
            ),
        ),
        CustomerId: new DynamicLabel(
            'Customer',
            this.getMetaItemValue(this.customers, this.contract && this.contract.hasOwnProperty('CustomerId') && this.contract.CustomerId !== null ? this.contract.CustomerId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        EndDate: new DynamicLabel(
            'End Date',
            this.contract && this.contract.EndDate || null,
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                InputTypes.Datepicker,
                null,
            ),
        ),
        Number: new DynamicLabel(
            'Number',
            this.contract && this.contract.hasOwnProperty('Number') && this.contract.Number !== null ? this.contract.Number.toString() : '',
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                null,
                null,
            ),
        ),
        ServiceDivisionId: new DynamicLabel(
            'Service Division',
            this.getMetaItemValue(this.servicedivisions, this.contract && this.contract.hasOwnProperty('ServiceDivisionId') && this.contract.ServiceDivisionId !== null ? this.contract.ServiceDivisionId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        StartDate: new DynamicLabel(
            'Start Date',
            this.contract && this.contract.StartDate || null,
            new DynamicFieldType(
                DynamicFieldTypes.Input,
                InputTypes.Datepicker,
                null,
            ),
        ),
        StatusId: new DynamicLabel(
            'Status',
            this.getMetaItemValue(this.statuses, this.contract && this.contract.hasOwnProperty('StatusId') && this.contract.StatusId !== null ? this.contract.StatusId : null),
            new DynamicFieldType(
                DynamicFieldTypes.Select,
                null,
                null,
            ),
        ),
        UserId: new DynamicLabel(
            'User',
            this.getMetaItemValue(this.users, this.contract && this.contract.hasOwnProperty('UserId') && this.contract.UserId !== null ? this.contract.UserId : null),
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
        private contract?: IContract,
        private formGroup = 'Contract',
        private customers?: ICustomer[],
        private servicedivisions?: IServiceDivision[],
        private statuses?: IContractStatus[],
        private users?: IUser[],
    ) { }
}
