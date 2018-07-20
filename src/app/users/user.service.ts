import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { BaseService } from '@mt-ng2/base-service';
import { IUser } from '../model/interfaces/user';
import { IPhone, IMetaItem } from '../model/interfaces/base';
import { SearchParams } from '@mt-ng2/common-classes';
import { IHasAddresses } from '@mt-ng2/entity-components-addresses';
import { IHasDocuments } from '@mt-ng2/entity-components-documents';
import { ICreateUserPayload } from '../model/interfaces/custom/create-user-payload';
import { Subject } from 'rxjs';
import { IAddress } from '@mt-ng2/dynamic-form';

@Injectable()
export class UserService extends BaseService<IUser> {
    private emptyUser: IUser = {
        AuthUserId: 0,
        Email: null,
        FirstName: null,
        Id: 0,
        LastName: null,
        Version: null,
    };

    private emitChangeSource = new Subject<IUser>();
    changeEmitted$ = this.emitChangeSource.asObservable();

    constructor(public http: HttpClient) {
        super('/users', http);
    }

    emitChange(user: IUser): void {
        this.emitChangeSource.next(user);
    }

    getEmptyUser(): IUser {
        return { ...this.emptyUser };
    }

    getSimplifiedUsers(): Observable<IMetaItem[]> {
        return this.http.get<IMetaItem[]>(`/users/simple`);
    }

    createUser(data: ICreateUserPayload): Observable<number> {
        return this.http.post<number>(`/users/create`, data);
    }

    saveAddress(userId: number, address: IAddress): Observable<number> {
        if (!address.Id) {
            address.Id = 0;
            return this.http.post<number>(`/users/${userId}/address`, address);
        } else {
            return this.http.put<number>(
                `/users/${userId}/address/${address.Id}`,
                address,
            );
        }
    }

    deleteAddress(userId: number): Observable<object> {
        return this.http.delete('/users/' + userId + '/address', {
            responseType: 'text' as 'json',
        });
    }

    savePhones(userId: number, phones: IPhone): any {
        return this.http.put<number>(`/users/${userId}/phones`, phones);
    }

    savePhoto(userId: number, photo: File): any {
        let formData: FormData = new FormData();
        formData.append('file', photo, photo.name);

        return this.http.post(`/users/${userId}/pic`, formData);
    }

    deletePhoto(userId: number): any {
        return this.http.delete(`/users/${userId}/pic`);
    }
}
