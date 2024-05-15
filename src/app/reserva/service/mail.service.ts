import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class MailService {

    //private urlApi = 'https://backend-reserva-node.azurewebsites.net';
    private urlApi = 'http://localhost:4000';

    constructor(private http: HttpClient) { }

    sendMail(users: any): Observable<any>{
        const url = `${this.urlApi}/sendMail/`;
        return this.http.post<any>(url, users);
    }
}
