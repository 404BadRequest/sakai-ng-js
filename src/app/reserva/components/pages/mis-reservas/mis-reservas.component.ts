import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { Product } from '../../../api/product';
import { ReservaService } from 'src/app/reserva/service/reserva.service';
import { Table } from 'primeng/table';
import { UserService } from 'src/app/reserva/service/user.service';

@Component({
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.scss'
})
export class MisReservasComponent implements OnInit{
  products!: Product[];
  userId : string;
  reservasByUser : any[] = [];
  cols: any[] = [];
  users: any[] = [];
  constructor(
    private productService: ProductService,
    private reservasService: ReservaService,
    private userService : UserService
    ){
  }
  ngOnInit() {
    const sessionUser = JSON.parse(localStorage.getItem('sessionUser'));
    this.getUserByAzureId(sessionUser.azureId);
  }
  getUserByAzureId(azureId: string){
    this.userService.getUserByAzureId(azureId).subscribe(
      (usersAzure: any[]) => {
        this.users = usersAzure;
        this.getReservasByUserId(this.users['Id']);
      },
      error => {
        console.error('Error al obtener los usuarios por azure id:', error);
      }
    )
  }
  getReservasByUserId(userId){
    this.reservasService.getReservaByUserId(userId).subscribe(
      (reseras: any[]) => {
        this.reservasByUser = reseras;
        //console.log("Reservas por usuario: ", this.reservasByUser);
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
