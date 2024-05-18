import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../api/product';
import { Observable } from 'rxjs';

@Injectable()
export class ProductService {

    //private urlApi = 'https://backend-reserva-node.azurewebsites.net';
    private urlApi = 'http://localhost:4000';

    constructor(private http: HttpClient) { }

    public getProductsApiJs(): Observable<any>{
        const url = `${this.urlApi}/products/`;
        return this.http.get<any>(url);
    }

    putProductById(Id: string, products: any): Observable<any>{
        const url = `${this.urlApi}/products/${Id}`;
        return this.http.put<any>(url, products);
    }

    createNewProduct(products: any): Observable<any>{
        const url = `${this.urlApi}/products/`;
        return this.http.post<any>(url, products);
    }
    deleteProductById(Id: string, products: any): Observable<any>{
        const url = `${this.urlApi}/products/${Id}`;
        return this.http.delete<any>(url, products);
    }
    getProductsSmall() {
        return this.http.get<any>('assets/reserva/data/products-small.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    getProducts() {
        return this.http.get<any>('assets/reserva/data/products.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    getProductsMixed() {
        return this.http.get<any>('assets/reserva/data/products-mixed.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    getProductsWithOrdersSmall() {
        return this.http.get<any>('assets/reserva/data/products-orders-small.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }
}
