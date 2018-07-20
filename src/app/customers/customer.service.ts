import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { BaseService } from '@mt-ng2/base-service';
import { ICustomer } from '../model/interfaces/customer';
import { INote } from '@mt-ng2/note-control';
import { IHasNotes } from '@mt-ng2/entity-components-notes';
import { IAddressContainer } from '@mt-ng2/dynamic-form';
import { IHasAddresses } from '@mt-ng2/entity-components-addresses';
import { IDocument, IHasDocuments } from '@mt-ng2/entity-components-documents';
import { IPhone } from '@mt-ng2/phone-control';
import { SearchParams } from '@mt-ng2/common-classes';
import { IContact } from '../model/interfaces/contact';
import { IHasContacts } from '@mt-ng2/entity-components-contacts/common-contacts.component';
import { Subject } from 'rxjs';
import { ICustomerLocation } from '../model/interfaces/customer-location';
import { CustomerLocationService } from '../customer-locations/customerlocation.service';
import { filter } from 'rxjs/operator/filter';
import { IMetaItem } from '../model/interfaces/base';

@Injectable()
export class CustomerService extends BaseService<ICustomer>
    implements IHasNotes, IHasDocuments, IHasAddresses, IHasContacts {
    private emptyCustomer: ICustomer = {
        Id: 0,
        Name: null,
        SourceId: 0,
        StatusId: 1,
        Version: null,
    };

    private emitChangeSource = new Subject<ICustomer>();
    changeEmitted$ = this.emitChangeSource.asObservable();

    location: ICustomerLocation[];
    customer: ICustomer[];
    simpleCustomer: IMetaItem[];

    constructor(
        public http: HttpClient,
        private customerLocationService: CustomerLocationService,
    ) {
        super('/customers', http);
    }

    getSimplifiedCustomers(): Observable<IMetaItem[]> {
        return this.http.get<IMetaItem[]>(`/customers/simple`);
    }

    emitChange(customer: ICustomer): void {
        this.emitChangeSource.next(customer);
    }

    getEmptyCustomer(): ICustomer {
        return { ...this.emptyCustomer };
    }

    getCustomerDetail(customerId: number): Observable<ICustomer> {
        return this.http.get<ICustomer>(`/customers/${customerId}/detail`);
    }

    getNotes(
        customerId: number,
        searchparameters: SearchParams,
    ): Observable<HttpResponse<INote[]>> {
        let params = this.getHttpParams(searchparameters);
        return this.http
            .get<INote[]>(`/customers/${customerId}/notes/_search`, {
                observe: 'response',
                params: params,
            })
            .catch(this.handleError);
    }

    saveNote(customerId: number, note: INote): Observable<number> {
        if (!note.Id) {
            note.Id = 0;
            return this.http.post<number>(
                `/customers/${customerId}/notes`,
                note,
            );
        } else {
            return this.http.put<number>(
                `/customers/${customerId}/notes`,
                note,
                { responseType: 'text' as 'json' },
            );
        }
    }

    deleteNote(customerId: number, noteId: number): Observable<object> {
        return this.http.delete(`/customers/${customerId}/notes/${noteId}`, {
            responseType: 'text' as 'json',
        });
    }

    getAddresses(
        customerId: number,
        searchparameters: SearchParams,
    ): Observable<HttpResponse<IAddressContainer[]>> {
        let params = this.getHttpParams(searchparameters);
        return this.http
            .get<IAddressContainer[]>(
                `/customers/${customerId}/addresses/_search`,
                { observe: 'response', params: params },
            )
            .catch(this.handleError);
    }

    saveAddress(
        customerId: number,
        address: IAddressContainer,
    ): Observable<number> {
        if (!address.AddressId) {
            address.AddressId = 0;
            address.Address.Id = 0;
            return this.http.post<number>(
                `/customers/${customerId}/addresses`,
                address,
            );
        } else {
            return this.http.put<number>(
                `/customers/${customerId}/addresses/${address.AddressId}`,
                address,
                { responseType: 'text' as 'json' },
            );
        }
    }

    deleteAddress(customerId: number, addressId: number): Observable<object> {
        return this.http.delete(
            `/customers/${customerId}/addresses/${addressId}`,
            { responseType: 'text' as 'json' },
        );
    }

    saveCustomerPhones(customerId: number, phoneCollection: any): any {
        return this.http.put(
            '/customers/' + customerId + '/phones',
            phoneCollection,
            { responseType: 'text' as 'json' },
        );
    }

    saveDocument(customerId: number, file: File): any {
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);

        return this.http.post(`/customers/${customerId}/documents`, formData);
    }

    deleteDocument(customerId: number, docId: number): Observable<object> {
        return this.http.delete(`/customers/${customerId}/documents/${docId}`, {
            responseType: 'text' as 'json',
        });
    }

    getDocument(customerId: number, docId: number): any {
        return this.http.get(`/customers/${customerId}/documents/${docId}`, {
            responseType: 'blob' as 'blob',
        });
    }

    getDocuments(
        customerId: number,
        searchparameters: SearchParams,
    ): Observable<HttpResponse<IDocument[]>> {
        let params = this.getHttpParams(searchparameters);
        return this.http
            .get<IDocument[]>(`/customers/${customerId}/documents/_search`, {
                observe: 'response',
                params: params,
            })
            .catch(this.handleError);
    }

    getContact(contactId: number): any {
        return this.http.get(`/customers/contacts/${contactId}`);
    }

    getContacts(
        customerId: number,
        searchparameters: SearchParams,
    ): Observable<HttpResponse<IContact[]>> {
        let params = this.getHttpParams(searchparameters);
        return this.http
            .get<IContact[]>(`/customers/${customerId}/contacts/_search`, {
                observe: 'response',
                params: params,
            })
            .catch(this.handleError);
    }

    saveContact(customerId: number, contact: IContact): any {
        if (contact.Id > 0) {
            return this.http.put(`/customers/${customerId}/contacts`, contact);
        } else {
            return this.http.post(`/customers/${customerId}/contacts`, contact);
        }
    }

    deleteContact(customerId: number, contactId: number): any {
        return this.http.delete(
            `/customers/${customerId}/contacts/${contactId}`,
        );
    }
}
