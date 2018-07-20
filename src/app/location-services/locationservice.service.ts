import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseService } from '@mt-ng2/base-service';
import { ILocationService } from '../model/interfaces/location-service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LocationServiceService extends BaseService<ILocationService> {
    private emptyLocationService: ILocationService = {
        Archived: null,
        ContractId: null,
        CustomerLocationId: null,
        GoodId: null,
        Id: 0,
        LongDescription: null,
        Price: null,
        Quantity: null,
        ShortDescription: null,
        Version: null,
    };

    private emitChangeSource = new Subject<ILocationService>();
    changeEmitted$ = this.emitChangeSource.asObservable();

    constructor(public http: HttpClient) {
        super('/locationservices', http);
    }
    emitChange(locationService: ILocationService): void {
        this.emitChangeSource.next(locationService);
    }
    getStateTaxRateByAddressId(addressId: number): Observable<any> {
        return this.http.get(`/locationservices/gettaxrate/${addressId}`);
    }
    getAllTaxes(): Observable<any> {
        return this.http.get(`/locationservices/getalltaxes`);
    }
    getAllTotals(): Observable<any> {
        return this.http.get(`/locationservices/getalltotals`);
    }
    getCustomServiceLocation(locationServiceId: number): Observable<any> {
        return this.http.get(
            `/locationservices/customservicelocation/${locationServiceId}`,
        );
    }
    toggleArchiveForLocation(locationId: number): Observable<any> {
        return this.http.put(`/locationservices/archive/${locationId}`, {
            responseType: 'text' as 'json',
        });
    }
    getTotalLineItem(locationServiceId: number): Observable<any> {
        return this.http.get(
            `/locationservices/gettotalline/${locationServiceId}`,
        );
    }
    getTaxPerItem(locationServiceId: number): Observable<any> {
        return this.http.get(`/locationservices/gettax/${locationServiceId}`);
    }
    getTotalForLocation(locationId: number): Observable<any> {
        return this.http.get(`/locationservices/gettotal/${locationId}`);
    }

    deleteLocationServiceById(locationServiceId: number): Observable<any> {
        return this.http.delete(`/locationservices/${locationServiceId}`, {
            responseType: 'text' as 'json',
        });
    }
    getEmptyLocationService(): ILocationService {
        return { ...this.emptyLocationService };
    }
    getLocationServicesForLocation(locationId: number): Observable<any> {
        return this.http.get(
            `/locationservices/servicesforlocation/${locationId}`,
        );
    }
}
