import { StateDynamicControls } from '../form-controls/state.form-controls';
import { Validators } from '@angular/forms';
import { IExpandableObject } from '../expandable-object';

import {
    DynamicField,
    DynamicFieldType,
    DynamicFieldTypes,
    DynamicLabel,
    noZeroRequiredValidator,
    InputTypes,
    NumericInputTypes,
    SelectInputTypes,
} from '@mt-ng2/dynamic-form';

import { IState } from '../interfaces/state';

export class StateDynamicControlsPartial extends StateDynamicControls {
    constructor() {
        super();
        (<DynamicField>this.Form.TaxRate).type.inputType =
            NumericInputTypes.Percentage;
        (<DynamicField>this.Form.TaxRate).type.scale = 2;
        (<DynamicField>this.Form.TaxRate).validation.push(Validators.max(99.9));
        (<DynamicField>this.Form.TaxRate).validators.max = 99.9;
        (<DynamicField>this.Form.TaxRate).validation.push(Validators.min(0));
        (<DynamicField>this.Form.TaxRate).validators.min = 0;
    }
}
