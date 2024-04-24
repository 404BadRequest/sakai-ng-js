import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Insumos } from '../api/insumos';
import { Observable } from 'rxjs';

@Injectable()
export class InsumosService {
    selectedInsumos: any[] = [];
    map(arg0: (role: any) => { name: any; code: any; }): any {
      throw new Error('Method not implemented.');
    }

    //private urlApi = 'https://backend-reserva-node.azurewebsites.net';
    private urlApi = 'http://localhost:4000';

    constructor(private http: HttpClient) { }

    getInsumosApiJs(): Observable<any>{
        const url = `${this.urlApi}/insumos/`;
        return this.http.get<any>(url);
    }

    getInsumoById(Id: string, parametrosDetalle: any): Observable<any>{
        const url = `${this.urlApi}/insumos/${Id}`;
        return this.http.get<any>(url);
    }

    getCountInsumos(Id: string): Observable<any>{
        const url = `${this.urlApi}/insumos/count`;
        return this.http.get<any>(url);
    }
}
