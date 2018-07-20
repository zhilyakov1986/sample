import { GoodDynamicControls } from '../model/form-controls/good.form-controls';
import { IGood } from '../model/interfaces/good';
import { IServiceType } from '../model/interfaces/service-type';
import { IUnitType } from '../model/interfaces/unit-type';
import { IServiceDivision } from '../model/interfaces/service-division';
import {
    IDynamicConfig,
    IDynamicFormConfig,
    DynamicConfig,
} from '@mt-ng2/dynamic-form';

export class GoodDynamicConfig<T extends IGood> extends DynamicConfig<T>
    implements IDynamicConfig<T> {
    constructor(
        private good: T,
        private servicetypes: IServiceType[],
        private unitType: IUnitType[],
        private serviceDivisions: IServiceDivision[],
        private configControls?: string[],
    ) {
        super();
        const dynamicControls = new GoodDynamicControls(
            this.good,
            'Good',
            this.unitType,
            this.servicetypes,
            this.serviceDivisions,
        );
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = [
                'Name',
                'ServiceDivisionId',
                'ServiceTypeId',
                'ServiceShortDescription',
                'ServiceLongDescription',
                'UnitTypeId',
                'Cost',
                'Price',
                'Taxable',
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
