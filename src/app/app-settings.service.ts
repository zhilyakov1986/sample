import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@mt-ng2/base-service';
import { ISetting } from './model/interfaces/setting';

@Injectable() export class AppSettingsService extends BaseService<ISetting> {

    constructor(public http: HttpClient) {
        super('/settings', http);
    }

    updateSettings(settings: ISetting[]): any {
        return this.http.put('/settings/batch', settings);
    }
}
