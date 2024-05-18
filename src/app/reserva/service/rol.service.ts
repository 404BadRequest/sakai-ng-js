import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rol } from '../api/rol';
import { Observable } from 'rxjs';

@Injectable()
export class RolService {

    private urlApi = 'https://backend-reserva-node.azurewebsites.net';
    //private urlApi = 'http://localhost:4000';

    constructor(private http: HttpClient) { }

    getRolsApiJs(): Observable<any>{
        const url = `${this.urlApi}/roles/`;
        return this.http.get<any>(url);
    }

    putRolById(Id: string, roles: any): Observable<any>{
        const url = `${this.urlApi}/roles/${Id}`;
        return this.http.put<any>(url, roles);
    }

    createNewRol(roles: any): Observable<any>{
        const url = `${this.urlApi}/roles/`;
        return this.http.post<any>(url, roles);
    }
    deleteRolById(Id: string, roles: any): Observable<any>{
        const url = `${this.urlApi}/roles/delete/${Id}`;
        return this.http.put<any>(url, roles);
    }
    getRolesVigentes(): Observable<any>{
        const url = `${this.urlApi}/roles/vigentes`;
        return this.http.get<any>(url);
    }
}
