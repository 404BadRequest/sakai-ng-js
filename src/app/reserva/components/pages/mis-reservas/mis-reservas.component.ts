import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { Product } from '../../../api/product';
import { ReservaService } from 'src/app/reserva/service/reserva.service';
import { Table } from 'primeng/table';
import { UserService } from 'src/app/reserva/service/user.service';

@Component({
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.scss']
})
export class MisReservasComponent implements OnInit {
  products!: Product[];
  userId: string;
  reservasByUser: any[] = [];
  cols: any[] = [];
  users: any[] = [];

  constructor(
    private productService: ProductService,
    private reservasService: ReservaService,
    private userService: UserService
  ) { }

  ngOnInit() {
    const sessionUser = JSON.parse(localStorage.getItem('sessionUser'));
    this.getUserByAzureId(sessionUser.azureId);
  }

  checkReservasVisibility() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.reservasByUser = this.reservasByUser.map(reserva => {
      const reservaDate = new Date(reserva.FechaReserva);
      //onsole.log("resaerva date: ", reservaDate, " - ", "tomorrow", tomorrow);
      reserva.visible = reservaDate >= tomorrow;
      return reserva;
    });
  }

  getUserByAzureId(azureId: string) {
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

  getReservasByUserId(userId: string) {
    this.reservasService.getReservaByUserId(userId).subscribe(
      (reservas: any[]) => {
        this.reservasByUser = reservas;
        this.checkReservasVisibility();
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

  onDeleteReserva(Id: string){
    this.reservasService.deleteReservaById(Id)
    .subscribe(response => {
        console.log({msg: response});
        //this.getUsers();
    }, error => {
        console.error('Error en la eliminación de la reserva:', error);
    });
}
}
