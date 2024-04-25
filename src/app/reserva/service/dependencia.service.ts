import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class DependenciaService {
    selectedInsumosDependencias: any[] = [];
    
    map(arg0: (role: any) => { name: any; code: any; }): any {
      throw new Error('Method not implemented.');
    }

    //private urlApi = 'https://backend-reserva-node.azurewebsites.net';
    private urlApi = 'http://localhost:4000';

    constructor(private http: HttpClient) { }

    getDependenciasApiJs(): Observable<any>{
        const url = `${this.urlApi}/dependencias/`;
        return this.http.get<any>(url);
    }

    getDependenciaById(Id: string, parametrosDetalle: any): Observable<any>{
        const url = `${this.urlApi}/dependencias/${Id}`;
        return this.http.get<any>(url);
    }
}