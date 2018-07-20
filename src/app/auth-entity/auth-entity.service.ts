import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IUserRole } from '../model/interfaces/user-role';
import { SearchParams } from '@mt-ng2/common-classes';

@Injectable()
export class AuthEntityService {

  constructor(public http: HttpClient) { }

  getAllRoles(): any {
    const searchParams: SearchParams = {
        extraParams: null,
        query: '*',
        skip: 0,
        take: 999,
    };
    const params = this.getHttpParams(searchParams);
    return this.http.get<IUserRole>('/userRoles/_search', { observe: 'response', params: params});
  }

  changeAccess(authUserId: number, hasAccess: boolean): any {
    return this.http.put(`/authUsers/${authUserId}/hasAccess/${hasAccess}`, {});
  }

  updatePortalAccess(authUserId: number, username: string, roleId: number): any {
    return this.http.put(`/authUsers/${authUserId}/portalAccess`, {Username: username, UserRoleId: roleId});
  }

  savePassword(authUserId: number, password: string, oldPassword: string, confirmPassword: string): any {
    return this.http.put(`/authUsers/updatePassword`, {AuthUserId: authUserId, Confirmation: confirmPassword, Password: password, OldPassword: oldPassword});
  }

  protected getHttpParams(searchparameters: SearchParams): HttpParams {
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

}
