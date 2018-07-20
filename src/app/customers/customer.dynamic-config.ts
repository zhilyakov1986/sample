import { CustomerDynamicControls } from '../model/form-controls/customer.form-controls';
import { ICustomer } from '../model/interfaces/customer';
import { ICustomerSource } from '../model/interfaces/customer-source';
import { ICustomerStatus } from '../model/interfaces/customer-status';
import { DynamicConfig, IDynamicConfig, IDynamicFormConfig } from '@mt-ng2/dynamic-form';

export class CustomerDynamicConfig<T extends ICustomer> extends DynamicConfig<T> implements IDynamicConfig<T> {

    constructor(
        private customer: T,
        private sources: ICustomerSource[],
        private statuses: ICustomerStatus[],
        private configControls?: string[]) {
        super();
        const dynamicControls = new CustomerDynamicControls(this.customer, 'Customer', this.sources, this.statuses);
         // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = ['Name', 'StatusId', 'SourceId'];
        }
        this.setControls(this.configControls, dynamicControls);
    }

    getForUpdate(additionalConfigs?: any[]): IDynamicFormConfig {
        return {
            formObject: this.getFormObject(additionalConfigs),
            viewOnly: this.DynamicLabels,
        };
    }

    getForCreate(additionalConfigs?: any[]): IDynamicFormConfig {
        return {
            formObject: this.getFormObject(additionalConfigs),
        };
    }
}
