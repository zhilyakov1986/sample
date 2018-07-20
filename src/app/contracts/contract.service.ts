import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BaseService } from '@mt-ng2/base-service';
import { SearchParams } from '@mt-ng2/common-classes';
import { IContract } from '../model/interfaces/contract';
import { Subject } from 'rxjs';

@Injectable()
export class ContractService extends BaseService<IContract> {
    private emptyContract: IContract = {
        Archived: null,
        CustomerId: null,
        EndDate: null,
        Id: 0,
        Number: null,
        ServiceAreas: [],
        ServiceDivisionId: null,
        StartDate: null,
        StatusId: 1,
        UserId: null,
        Version: null,
    };

    private emitChangeSource = new Subject<IContract>();
    changeEmitted$ = this.emitChangeSource.asObservable();

    constructor(public http: HttpClient) {
        super('/contracts', http);
    }

    update(object: IContract): any {
        const clone = JSON.parse(JSON.stringify(object));
        const tempServiceAreas = clone.ServiceAreas;
        this.nullOutFK(clone);
        clone.ServiceAreas = tempServiceAreas;
        return this.http
            .put('/contracts' + '/' + clone.Id, clone)
            .catch(this.handleError);
    }

    nullOutFK(object: IContract): IContract {
        for (let /** @type {?} */ prop in object) {
            if (typeof object[prop] === 'object') {
                object[prop] = null;
            }
        }
        return object;
    }

    emitChange(contract: IContract): void {
        this.emitChangeSource.next(contract);
    }
    getEmptyContract(): IContract {
        return { ...this.emptyContract };
    }
    getUserRole(userId: number): Observable<any> {
        return this.http.get(`/contracts/getuserrole/${userId}`);
    }
}
