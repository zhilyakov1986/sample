import { Component, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { IState } from '../../model/interfaces/state';

import { DynamicField, InputTypes } from '@mt-ng2/dynamic-form';

import { StatesService } from '../states.service';
import { StateDynamicControls } from '../../model/form-controls/state.form-controls';
import { StateDynamicControlsPartial } from '../../model/partials/state.form-controls';

import { CommonService } from '../../common/services/common.service';
import { IItemSelectedEvent } from '@mt-ng2/entity-list-module';

@Component({
    selector: 'app-state',
    templateUrl: './state.component.html',
})
export class StateComponent implements OnInit {
    stateServiceDynamicForm = new StateDynamicControlsPartial().Form;
    constructor(private statesService: StatesService) {}
    ngOnInit(): void {}
}
