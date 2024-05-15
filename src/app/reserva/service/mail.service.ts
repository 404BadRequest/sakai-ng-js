import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class EnvioMailService {

    //private urlApi = 'https://backend-reserva-node.azurewebsites.net';
    private urlApi = 'http://localhost:4000';

    constructor(private http: HttpClient) { }

    sendMail(params: any): Observable<any>{
        const url = `${this.urlApi}/envio/`;
        return this.http.post<any>(url, params);
    }
}
