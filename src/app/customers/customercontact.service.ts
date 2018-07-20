import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { IAddress, IPhone } from '../model/interfaces/base';
import { SearchParams } from '@mt-ng2/common-classes';
import { IHasAddresses } from '@mt-ng2/entity-components-addresses';
import { IContact } from '../model/interfaces/contact';

@Injectable()

// TODO Implement IHasAddress?
export class CustomerContactService {

    constructor(public http: HttpClient) {
    }

    getContactAddress(contactId: number): any {
        return this.http.get(`/customers/contacts/${contactId}`);
    }

    saveContactAddress(customerId: number, contactId: number, address: IAddress): any {
        if (address.Id > 0) {
            return this.http.put(`/customers/${customerId}/contacts/${contactId}/addresses`, address);
        } else {
            return this.http.post(`/customers/${customerId}/contacts/${contactId}/address`, address);
        }
    }

    deleteContactAddress(customerId: number, contactId: number, addressId: number): any {
        return this.http.delete(`/customers/${customerId}/contacts/${contactId}/addresses/${addressId}`);
    }

    saveContactPhones(customerId: number, contactId: number, phones: IPhone[]): any {
        return this.http.put(`/customers/${customerId}/contacts/${contactId}/phones`, phones);
    }
}
