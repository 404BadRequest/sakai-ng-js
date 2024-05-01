import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { Product } from '../../../api/product';
import { ReservaService } from 'src/app/reserva/service/reserva.service';
import { Table } from 'primeng/table';

@Component({
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.scss'
})
export class MisReservasComponent implements OnInit{
  products!: Product[];
  userId : string;
  reservasByUser : any[] = [];
  cols: any[] = [];
  constructor(
    private productService: ProductService,
    private reservasService: ReservaService
    ){
  }
  ngOnInit() {
    this.userId = "13";
    this.productService.getProductsSmall().then(data => this.products = data);
    this.getReservasByUserId(this.userId);
  }

  getReservasByUserId(userId){
    this.reservasService.getReservaByUserId(userId).subscribe(
      (reseras: any[]) => {
        this.reservasByUser = reseras;
        console.log("Reservas por usuario: ", this.reservasByUser);
      },
      error => {
        console.error('Error al obtener las reservas del usuario:', error);
      }
    );
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
