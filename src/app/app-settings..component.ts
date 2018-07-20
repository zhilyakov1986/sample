import {DynamicField} from '@mt-ng2/dynamic-form';
import {FormArray, FormGroup} from '@angular/forms';
import {FormBuilder} from '@angular/forms';
import {SettingDynamicControls} from './model/form-controls/setting.form-controls';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from './app-settings.service';
import { ISetting } from './model/interfaces/setting';
import { NotificationsService } from '@mt-ng2/notifications-module';

@Component({
    selector: 'app-settings',
    templateUrl: './app-settings.component.html',
})
export class AppSettingsComponent implements OnInit {

    form: FormGroup;
    formArray: FormArray;
    settingsDynamicForm = new SettingDynamicControls(null).Form;
    settings: ISetting[] = [];
    constructor(
        private appSettingsService: AppSettingsService,
        private notificationsService: NotificationsService,
        private fb: FormBuilder,
    ) {}

    ngOnInit(): void {
        this.setForm();
        this.appSettingsService.getAll()
            .subscribe((answer) => {
                this.settings = answer;
                this.setForm();
            });
    }

    setForm(): void {
        this.form = this.fb.group({});
        let formGroups = this.settings.map((item) => this.fb.group(item));
        this.formArray = this.fb.array(formGroups);
        this.form.addControl('Settings', this.formArray);
    }

    get currentFormArray(): FormArray {
        return this.form.get('Settings') as FormArray;
    }

    getLabel(form: FormGroup): string {
        const fieldName = 'Name';
        return form.controls[fieldName].value;
    }

    getField(form: FormGroup): DynamicField {
        const fieldName = 'Value';
        let dynamicField = <DynamicField>{ ...this.settingsDynamicForm[fieldName] };
        dynamicField.value = form.controls[fieldName].value;
        dynamicField.hideLabel = true;
        dynamicField.insideBoxValidation = true;
        return dynamicField;
    }

    save(form): void {
        this.appSettingsService.updateSettings(this.form.value.Settings)
            .subscribe((answer) => {
                this.notificationsService.success('Settings Saved Successfully');
            });
    }
}
