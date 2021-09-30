import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse, Orders } from 'src/app/modules/admin/state/admin.model';
import * as serviceConstants from '../service.constants';

@Injectable({
    providedIn: 'root',
})
export class OrdersServerService {
    constructor(private http: HttpClient) {}

    getOrders(): Observable<APIResponse<Orders>> {
        return this.http.get<APIResponse<Orders>>(
            `${serviceConstants.api_URL}${serviceConstants.orders}`,
        );
    }
}