import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParametroDetalle } from '../api/parametroDetalle';
import { Observable } from 'rxjs';

@Injectable()
export class ParametroDetalleService {
    selectedInsumos: any[] = [];
    map(arg0: (role: any) => { name: any; code: any; }): any {
      throw new Error('Method not implemented.');
    }

    //private urlApi = 'https://backend-reserva-node.azurewebsites.net';
    private urlApi = 'http://localhost:4000';

    constructor(private http: HttpClient) { }

    getParametroDetallesApiJs(): Observable<any>{
        const url = `${this.urlApi}/parametrosDetalle/`;
        return this.http.get<any>(url);
    }

    getParametroDetalleById(Id: string, parametrosDetalle: any): Observable<any>{
        const url = `${this.urlApi}/parametrosDetalle/${Id}`;
        return this.http.get<any>(url);
    }

    getParametroDetalleByIdParametro(Id: string): Observable<any>{
        const url = `${this.urlApi}/parametrosDetalle/parametro/${Id}`;
        return this.http.get<any>(url);
    }
}
