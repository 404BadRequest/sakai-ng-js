import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {

    //private urlApi = 'https://backend-reserva-node.azurewebsites.net';
    private urlApi = 'http://localhost:4000';

    constructor(private http: HttpClient) { }

    getUsersApiJs(): Observable<any>{
        const url = `${this.urlApi}/users/`;
        return this.http.get<any>(url);
    }

    getUsersCount(): Observable<any>{
        const url = `${this.urlApi}/users/count`;
        return this.http.get<any>(url);
    }

    getUserByAzureId(AzureId: string): Observable<any>{
        const url = `${this.urlApi}/users/azureId/${AzureId}`;
        return this.http.get<any>(url);
    }

    putUserById(Id: string, users: any): Observable<any>{
        const url = `${this.urlApi}/users/${Id}`;
        return this.http.put<any>(url, users);
    }

    createNewUser(users: any): Observable<any>{
        const url = `${this.urlApi}/users/`;
        return this.http.post<any>(url, users);
    }
    deleteUserById(Id: string, users: any): Observable<any>{
        const url = `${this.urlApi}/users/delete/${Id}`;
        return this.http.put<any>(url, users);
    }
    getUsersVigentes(): Observable<any>{
        const url = `${this.urlApi}/users/vigentes`;
        return this.http.get<any>(url);
    }
    getUserById(Id: string): Observable<any>{
        const url = `${this.urlApi}/users/${Id}`;
        return this.http.get<any>(url);
    }
}
