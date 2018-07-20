import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';

import { IStatesService, IState, ICountriesService, ICountry } from '@mt-ng2/dynamic-form';
import { CommonFunctionsService } from '@mt-ng2/common-functions';
import { IContactStatus } from '../../model/interfaces/contact-status';

@Injectable()
export class CommonService implements IStatesService, ICountriesService {
  private _states: IState[];
  private _countries: ICountry[];
  private _statuses: IContactStatus[];

  constructor(private http: HttpClient, private commonFunctions: CommonFunctionsService) { }

  getStates(): Observable<IState[]> {
    if (!this._states) {
      return this.http.get<IState[]>('/options/states')
        .do((answer) => {
          this.commonFunctions.sortByProperty(answer, 'Name');
          this._states = answer;
        });
    } else {
      return Observable.of(this._states);
    }
  }

  getCountries(): Observable<ICountry[]> {
    if (!this._countries) {
      return this.http.get<ICountry[]>('/options/countries')
        .do((answer) => {
          this.commonFunctions.sortByProperty(answer, 'Name');
          let indexOfUS = answer.findIndex((country) => country.CountryCode === 'US');
          answer.splice(0, 0, answer.splice(indexOfUS, 1)[0]);
          this._countries = answer;
        });
    } else {
      return Observable.of(this._countries);
    }
  }

  getContactStatuses(): Observable<IContactStatus[]> {
    if (!this._statuses) {
      return this.http.get<IContactStatus[]>('/options/contactStatuses')
        .do((answer) => this._statuses = answer);
    } else {
      return Observable.of(this._statuses);
    }
  }

}
