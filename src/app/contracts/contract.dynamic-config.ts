import { ContractDynamicControls } from '../model/form-controls/contract.form-controls';
import { ContractDynamicControlsPartial } from '../model/partials/contract.form-controls';
import { IContract } from '../model/interfaces/contract';
import { ICustomer } from '../model/interfaces/customer';
import { IContractStatus } from '../model/interfaces/contract-status';
import { IServiceDivision } from '../model/interfaces/service-division';

import {
    IDynamicConfig,
    IDynamicFormConfig,
    DynamicConfig,
    DynamicField,
    DynamicFieldType,
    DynamicFieldTypes,
    SelectInputTypes,
    DynamicLabel,
} from '@mt-ng2/dynamic-form';
import { IServiceArea } from '../model/interfaces/service-area';
import { IMetaItem } from '../model/interfaces/base';
import { IUser } from '../model/interfaces/user';
export class ContractDynamicConfig<T extends IContract> extends DynamicConfig<T>
    implements IDynamicConfig<T> {
    constructor(
        private contract: T,
        private customer?: IMetaItem[],
        private statuses?: IContractStatus[],
        private servicedivisions?: IServiceDivision[],
        private configControls?: string[],
        private serviceAreas?: IServiceArea[],
        private user?: IMetaItem[],
    ) {
        super();
        const dynamicControls = new ContractDynamicControlsPartial(
            this.contract,
            'Contract',
            this.customer,
            this.servicedivisions,
            this.statuses,
            this.user,
        );
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = [
                'StartDate',
                'EndDate',
                'CustomerId',
                'ServiceDivisionId',
                'UserId',
                'Archived',
            ];
        }
        this.setControls(this.configControls, dynamicControls);
    }

    getForUpdate(additionalConfigs?: any[]): IDynamicFormConfig {
        let formObject = this.getFormObject(additionalConfigs);
        formObject.push(
            new DynamicField(
                'Contract',
                'Service Areas',
                this.contract.ServiceAreas.map((sa) => sa.Id),
                'ServiceAreas',
                new DynamicFieldType(
                    DynamicFieldTypes.Select,
                    SelectInputTypes.MultiselectDropdown,
                ),
                this.serviceAreas,
            ),
        );

        let viewOnly = this.DynamicLabels;
        viewOnly.push(
            new DynamicLabel(
                'ServiceArea',
                this.contract.ServiceAreas.map((sa) => sa.Name).join(', '),
                new DynamicFieldType(DynamicFieldTypes.Input, null, null),
            ),
        );

        return {
            formObject: formObject,
            viewOnly: viewOnly,
        };
    }

    getForCreate(additionalConfigs?: any[]): IDynamicFormConfig {
        let formObject = this.getFormObject(additionalConfigs);
        formObject.push(
            new DynamicField(
                'Contract',
                'Service Areas',
                this.contract.ServiceAreas.map((sa) => sa.Id),
                'ServiceAreas',
                new DynamicFieldType(
                    DynamicFieldTypes.Select,
                    SelectInputTypes.MultiselectDropdown,
                ),
                this.serviceAreas,
            ),
        );
        let viewOnly = this.DynamicLabels;
        viewOnly.push(
            new DynamicLabel(
                'ServiceArea',
                'this works!!',
                new DynamicFieldType(DynamicFieldTypes.Input, null, null),
            ),
        );
        return {
            formObject: this.getFormObject(additionalConfigs),
        };
    }

    assignFormValues(object: T, formValue: T): void {
        for (let prop in formValue) {
            if (prop === 'ServiceAreas') {
                let selectedServiceAreas: any = this.serviceAreas.filter((sa) =>
                    (<any>formValue.ServiceAreas).includes(sa.Id),
                );
                object[prop] = selectedServiceAreas;
            } else {
                if (object.hasOwnProperty(prop)) {
                    object[prop] = formValue[prop];
                }
            }
        }
    }
}
