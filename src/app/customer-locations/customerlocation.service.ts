import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BaseService } from '@mt-ng2/base-service';
import { SearchParams } from '@mt-ng2/common-classes';
import { ICustomerLocation } from '../model/interfaces/customer-location';
import { ICustomer } from '../model/interfaces/customer';
import { CustomerService } from '../customers/customer.service';
import { Subject } from 'rxjs';
import { IDocument, IHasDocuments } from '@mt-ng2/entity-components-documents';
import { IAddressContainer, IAddress } from '@mt-ng2/dynamic-form';

@Injectable()
export class CustomerLocationService extends BaseService<ICustomerLocation> {
    private emptyCustomerLocation: ICustomerLocation = {
        AddressId: null,
        Archived: null,
        CustomerId: null,
        Id: 0,
        Name: null,
        ServiceAreaId: null,
        Version: null,
    };
    private emitChangeSource = new Subject<ICustomerLocation>();
    changeEmitted$ = this.emitChangeSource.asObservable();

    customer: ICustomer[];

    constructor(public http: HttpClient) {
        super('/customerlocations', http);
    }
    emitChange(customerLocation: ICustomerLocation): void {
        this.emitChangeSource.next(customerLocation);
    }

    getEmptyCustomerLocation(): ICustomerLocation {
        return { ...this.emptyCustomerLocation };
    }

    getLocationByCustomer(customerId: number): Observable<any> {
        return this.http.get(`/customerlocations/getlocations/${customerId}`);
    }

    // ----------------------------------------------------------Documents----------------------------------------------------------------------------
    saveDocument(customerLocationId: number, file: File): any {
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);

        return this.http.post(
            `/customerlocations/${customerLocationId}/documents`,
            formData,
        );
    }

    deleteDocument(
        customerLocationId: number,
        docId: number,
    ): Observable<object> {
        return this.http.delete(
            `/customerlocations/${customerLocationId}/documents/${docId}`,
            {
                responseType: 'text' as 'json',
            },
        );
    }

    getDocument(customerLocationId: number, docId: number): any {
        return this.http.get(
            `/customerlocations/${customerLocationId}/documents/${docId}`,
            {
                responseType: 'blob' as 'blob',
            },
        );
    }

    getDocuments(
        customerLocationId: number,
        searchparameters: SearchParams,
    ): Observable<HttpResponse<IDocument[]>> {
        let params = this.getHttpParams(searchparameters);
        return this.http
            .get<IDocument[]>(
                `/customerlocations/${customerLocationId}/documents/_search`,
                {
                    observe: 'response',
                    params: params,
                },
            )
            .catch(this.handleError);
    }
    // ----------------------------------------------------------Adresses----------------------------------------------------------------------------

    saveAddress(
        customerLocationId: number,
        address: IAddress,
    ): Observable<number> {
        if (!address.Id) {
            address.Id = 0;
            return this.http.post<number>(
                `/customerlocations/${customerLocationId}/address`,
                address,
            );
        } else {
            return this.http.put<number>(
                `/customerlocations/${customerLocationId}/address/${
                    address.Id
                }`,
                address,
                { responseType: 'text' as 'json' },
            );
        }
    }

    deleteAddress(customerLocationId: number): Observable<object> {
        return this.http.delete(
            '/customerlocations/' + customerLocationId + '/address',
            {
                responseType: 'text' as 'json',
            },
        );
    }
}
