import { Injectable } from '@angular/core';
import { IUserRole } from '../model/interfaces/user-role';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { IClaimType } from '../model/interfaces/claim-type';
import { Observable, Subject } from 'rxjs';
import { IClaimValue } from '../model/interfaces/claim-value';
import { SearchParams } from '@mt-ng2/common-classes';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { AppError, NotFoundError } from '@mt-ng2/errors-module';

@Injectable()
export class UserRoleService {

    private emitChangeSource = new Subject<IUserRole>();
    changeEmitted$ = this.emitChangeSource.asObservable();

    private emptyUserRole: IUserRole = {
        Description: null,
        Id: 0,
        IsEditable: true,
        Name: null,
    };

    constructor(public http: HttpClient) {}

    emitChange(role: IUserRole): void {
        this.emitChangeSource.next(role);
    }

    getEmptyUserRole(): IUserRole {
        return { ...this.emptyUserRole };
    }

    getClaimTypes(): Observable<IClaimType[]> {
        return this.http.get<IClaimType[]>('/userRoles/claimTypes');
    }

    getClaimValues(): Observable<IClaimValue[]> {
        return this.http.get<IClaimValue[]>('/userRoles/claimValues');
    }

    deleteRole(roleId: number): Observable<IUserRole> {
        return this.http.delete<IUserRole>(`/userRoles/delete/${roleId}`);
    }

    getRoleById(roleId: number): Observable<IUserRole> {
        return this.http.get<IUserRole>(`/userRoles/${roleId}`);
    }

    getRolesWithClaims(): Observable<IUserRole[]> {
        return this.http.get<IUserRole[]>('/userRoles/withClaims');
    }

    saveUserRole(role: IUserRole): Observable<IUserRole> {
        if (role.Id > 0) {
            return this.http.put<IUserRole>('/userRoles/update', role);
        } else {
            return this.http.post<IUserRole>('/userRoles/create', role);
        }
    }

    get(searchParams: SearchParams): Observable<HttpResponse<IUserRole[]>> {
        let params = this.getHttpParams(searchParams);
        return this.http.get<IUserRole[]>('/userRoles/_search', { observe: 'response', params: params})
        .catch(this.handleError);
    }

    updateClaims(roleId: number, claims: any): Observable<Object> {
        return this.http.put(`/userRoles/${roleId}/updateClaims`, claims);
    }

    getHttpParams(searchparameters: SearchParams): HttpParams {
        let params = new HttpParams();
        if (searchparameters.query) { params = params.append('query', searchparameters.query); }
        if (searchparameters.skip) { params = params.append('skip', searchparameters.skip.toString()); }
        if (searchparameters.take) { params = params.append('take', searchparameters.take.toString()); }
        if (searchparameters.extraParams && searchparameters.extraParams.length > 0) {
          let extraparams = new HttpParams();
          searchparameters.extraParams.forEach((param) => {
            if (param.valueArray) {
              if (param.valueArray.length > 0) { extraparams = extraparams.append(param.name, param.valueArray.toString()); }
            } else {
              if (param.value.length > 0) { extraparams = extraparams.set(param.name, param.value); }
            }
          });
          if (extraparams.keys().length > 0) { params = params.append('extraparams', extraparams.toString()); }
        }
        return params;
    }

    handleError(error: Response, formObject?: any): ErrorObservable {
        if (error.status === 400) {
          return Observable.throw(error);
        }
        if (error.status === 404) {
          return Observable.throw(new NotFoundError());
        }
        return Observable.throw(new AppError(error, formObject));
    }

}
