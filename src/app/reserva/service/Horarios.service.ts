import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class HorariosService {
    
    //private urlApi = 'https://backend-reserva-node.azurewebsites.net';
    private urlApi = 'http://localhost:4000';

    constructor(private http: HttpClient) { }

    getHorariosContinuo(): Observable<any>{
        const url = `${this.urlApi}/horarios/`;
        return this.http.get<any>(url);
    }

    getHorariosUtilizados(): Observable<any>{
        const url = `${this.urlApi}/horarios/utilizados`;
        return this.http.get<any>(url);
    }
}
