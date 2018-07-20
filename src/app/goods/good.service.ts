import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BaseService } from '@mt-ng2/base-service';
import { SearchParams } from '@mt-ng2/common-classes';
import { IGood } from '../model/interfaces/good';
import { Subject } from 'rxjs';
import { IDocument, IHasDocuments } from '@mt-ng2/entity-components-documents';

@Injectable()
export class GoodService extends BaseService<IGood> {
    private emptyGood: IGood = {
        Archived: null,
        Cost: null,
        Id: 0,
        Name: null,
        Price: null,
        ServiceDivisionId: null,
        ServiceLongDescription: null,
        ServiceShortDescription: null,
        ServiceTypeId: null,
        Taxable: null,
        UnitTypeId: null,
        Version: null,
    };

    private emitChangeSource = new Subject<IGood>();
    changeEmitted$ = this.emitChangeSource.asObservable();

    constructor(public http: HttpClient) {
        super('/goods', http);
    }
    emitChange(good: IGood): void {
        this.emitChangeSource.next(good);
    }

    getEmptyGood(): IGood {
        return { ...this.emptyGood };
    }

    saveDocument(goodId: number, file: File): any {
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);

        return this.http.post(`/goods/${goodId}/documents`, formData);
    }

    deleteDocument(goodId: number, docId: number): Observable<object> {
        return this.http.delete(`/goods/${goodId}/documents/${docId}`, {
            responseType: 'text' as 'json',
        });
    }

    getDocument(goodId: number, docId: number): any {
        return this.http.get(`/goods/${goodId}/documents/${docId}`, {
            responseType: 'blob' as 'blob',
        });
    }

    getDocuments(
        goodId: number,
        searchparameters: SearchParams,
    ): Observable<HttpResponse<IDocument[]>> {
        let params = this.getHttpParams(searchparameters);
        return this.http
            .get<IDocument[]>(`/goods/${goodId}/documents/_search`, {
                observe: 'response',
                params: params,
            })
            .catch(this.handleError);
    }
}
