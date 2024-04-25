import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ReservaHorariosService {
    
    //private urlApi = 'https://backend-reserva-node.azurewebsites.net';
    private urlApi = 'http://localhost:4000';

    constructor(private http: HttpClient) { }

    getReservaHorariosApiJs(): Observable<any>{
        const url = `${this.urlApi}/reservasHorarios/`;
        return this.http.get<any>(url);
    }
    createNewReservaHorarios(reservaHorarios: any): Observable<any>{
        const url = `${this.urlApi}/reservaHorarios`;
        return this.http.post<any>(url, reservaHorarios);
    }
}
