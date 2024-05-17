import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { Product } from '../../../api/product';
import { ReservaService } from 'src/app/reserva/service/reserva.service';
import { UserService } from 'src/app/reserva/service/user.service';
import { Table } from 'primeng/table';

@Component({
  templateUrl: './mis-aprobaciones.component.html',
  styleUrl: './mis-aprobaciones.component.scss'
})
export class MisAprobacionesComponent implements OnInit{
  products!: Product[];
  userId : string;
  reservasByUserOtras : any[] = [];
  cols: any[] = [];
  users: any[] = [];

  constructor(
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
    const reservaIds = new Set();
    this.reservasService.getReservasByUserIdByInsumos(userId).subscribe(
      (reservas: any[]) => {
        const registrosUnicos = reservas.filter(registro => {
          if (!reservaIds.has(registro.Id)) {
            reservaIds.add(registro.Id);
            return true;
          }
          return false;
        });
        this.reservasByUserOtras = registrosUnicos;
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
