import { CustomerLocationDynamicControlsPartial } from '../model/partials/customer-location.form-controls';

import { ICustomerLocation } from '../model/interfaces/customer-location';
import {
    IDynamicConfig,
    IDynamicFormConfig,
    DynamicConfig,
} from '@mt-ng2/dynamic-form';
import { IServiceArea } from '../model/interfaces/service-area';
import { IAddress, IMetaItem } from '../model/interfaces/base';
import { ICustomer } from '../model/interfaces/customer';
export class CustomerLocationDynamicConfig<T extends ICustomerLocation>
    extends DynamicConfig<T>
    implements IDynamicConfig<T> {
    constructor(
        private customerLocation: T,
        private serviceareas?: IServiceArea[],
        private simpleCustomer?: IMetaItem[],
        private configControls?: string[],
    ) {
        super();
        const dynamicControls = new CustomerLocationDynamicControlsPartial(
            this.customerLocation,
            'CustomerLocation',
            this.simpleCustomer,
            this.serviceareas,
        );
        // default form implementation can be overridden at the component level
        if (!configControls) {
            // What you get in the form! including sequence
            this.configControls = [
                'Name',
                'CustomerId',
                'ServiceAreaId',
                'Archived',
            ];
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
