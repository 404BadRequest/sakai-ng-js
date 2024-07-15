import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ReservaService {

    private urlApi = 'https://backend-reserva-node.azurewebsites.net';
    //private urlApi = 'http://localhost:4000';

    constructor(private http: HttpClient) { }

    getReservasApiJs(): Observable<any>{
        const url = `${this.urlApi}/reservas/`;
        return this.http.get<any>(url);
    }
    getReservasCount(): Observable<any>{
        const url = `${this.urlApi}/reservas/count`;
        return this.http.get<any>(url);
    }
    getReservasCount7dias(): Observable<any>{
        const url = `${this.urlApi}/reservas/count/dias`;
        return this.http.get<any>(url);
    }
    getReservasCountMeses(): Observable<any>{
        const url = `${this.urlApi}/reservas/meses/count`;
        return this.http.get<any>(url);
    }
    createNewReserva(reserva: any): Observable<any>{
        const url = `${this.urlApi}/reservas/`;
        return this.http.post<any>(url, reserva);
    }
    getReservaById(Id: string): Observable<any>{
        const url = `${this.urlApi}/reservas/${Id}`;
        return this.http.get<any>(url);
    }
    getReservasByUserIdByInsumos(Id: string): Observable<any>{
        const url = `${this.urlApi}/reservas/user/insumos/${Id}`;
        return this.http.get<any>(url);
    }
    getReservaByUserId(UserId: string): Observable<any>{
        const url = `${this.urlApi}/reservas/userId/${UserId}`;
        return this.http.get<any>(url);
    }

    getReservaIdByInsumo(ReservaId: string): Observable<any>{
        const url = `${this.urlApi}/reservas/insumos/${ReservaId}`;
        return this.http.get<any>(url);
    }

    getReservaDependenciaById(ReservaId: string): Observable<any>{
        const url = `${this.urlApi}/reservas/dependencias/${ReservaId}`;
        return this.http.get<any>(url);
    }
    deleteReservaById(Id: string): Observable<any>{
        const url = `${this.urlApi}/reservas/delete/${Id}`;
        return this.http.delete<any>(url);
    }
}
