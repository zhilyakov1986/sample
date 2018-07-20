import { Component, OnInit } from '@angular/core';
import { DynamicField, InputTypes } from '@mt-ng2/dynamic-form';

import { ServiceAreaService } from '../service-area.service';
import { ServiceDivisionService } from '../service-division.service';
import { UnitTypeService } from '../unit-type.service';

import { ServiceAreaDynamicControls } from '../../model/form-controls/service-area.form-controls';
import { ServiceDivisionDynamicControls } from '../../model/form-controls/service-division.form-controls';
import { UnitTypeDynamicControls } from '../../model/form-controls/unit-type.form-controls';

@Component({
    selector: 'app-lists',
    templateUrl: './lists.component.html',

})
export class ListsComponent implements OnInit {
    serviceAreaDynamicForm = new ServiceAreaDynamicControls().Form;
    serviceDivisionDynamicForm = new ServiceDivisionDynamicControls().Form;
    unitTypeDynamicForm = new UnitTypeDynamicControls().Form;
    constructor(
        private serviceAreaService: ServiceAreaService,
        private serviceDivisionService: ServiceDivisionService,
        private unitTypeService: UnitTypeService,
    ) { }

    ngOnInit(): void {
        (<DynamicField>this.serviceAreaDynamicForm.Name).type.inputType =
            InputTypes.Textbox;
        (<DynamicField>this.serviceDivisionDynamicForm.Name).type.inputType =
            InputTypes.Textbox;
        (<DynamicField>this.unitTypeDynamicForm.Name).type.inputType =
            InputTypes.Textbox;
    }
}
