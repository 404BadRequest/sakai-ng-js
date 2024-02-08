import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/reserva/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/reserva/service/product.service';

interface expandedRows {
    [key: string]: boolean;
}
@Component({
    templateUrl: './admin-salas.component.html',
    providers: [MessageService]
})
export class AdminSalasComponent implements OnInit{ 
    
    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[] = [];

    product: Product = {};

    selectedProducts: Product[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private productService: ProductService, private messageService: MessageService) { }

    
    ngOnInit() {
        
        this.productService.getProductsApiJs().subscribe(data => this.products = data);

        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.products = this.products.filter(val => !this.selectedProducts.includes(val));
        this.messageService.add({ severity: 'error', summary: 'Successful', detail: 'Producto eliminado', life: 3000 });
        this.selectedProducts = [];
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.onDeleteProduct(this.product.Id, this.product);
        this.messageService.add({ severity: 'error', summary: 'Successful', detail: 'Producto eliminado', life: 3000 });
        this.product = {};
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;
        
        if (this.product.Name?.trim()) {
            if (this.product.Id) {
                this.onUpdateProduct(this.product.Id, this.product);
                this.messageService.add({ severity: 'success', summary: 'Modificación', detail: 'Producto actualizado', life: 3000 });

            } else {
                this.onCreateNewProduct(this.product);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }

    onUpdateProduct(Id: string, product){
        this.productService.putProductById(Id, product)
        .subscribe(response => {
            console.log({msg: `Registro actualizado`});
            this.productService.getProductsApiJs().subscribe(data => this.products = data);
        }, error => {
            console.error('Error en la solicitud:', error);
        });
    }
    onCreateNewProduct(product){
        this.productService.createNewProduct(product)
        .subscribe(response => {
            console.log({msg: `Registro creado`});
            this.productService.getProductsApiJs().subscribe(data => this.products = data);
        }, error => {
            console.error('Error en la solicitud:', error);
        });
    }
    onDeleteProduct(Id: string, product){
        this.productService.deleteProductById(Id, product)
        .subscribe(response => {
            console.log({msg: `Registro eliminado`});
            this.productService.getProductsApiJs().subscribe(data => this.products = data);
        }, error => {
            console.error('Error en la solicitud:', error);
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].Id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
