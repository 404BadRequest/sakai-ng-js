import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { Product } from '../../../api/product';
import { ReservaService } from 'src/app/reserva/service/reserva.service';
import { Table } from 'primeng/table';
import { UserService } from 'src/app/reserva/service/user.service';
import { MessageService } from 'primeng/api';
import { EnvioMailService } from 'src/app/reserva/service/mail.service';
import { InsumosService } from 'src/app/reserva/service/insumos.service';

@Component({
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.scss'],
  providers: [MessageService]
})
export class MisReservasComponent implements OnInit {
  products!: Product[];
  userId: string;
  reservasByUser: any[] = [];
  cols: any[] = [];
  users: any[] = [];
  deleteUserDialog: boolean = false;
  deleteUsersDialog: boolean = false;
  reservaId : string;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  deleteUserDialogConfirm: boolean=false;
  editUserDialog: boolean = false;
  datosReservaEdit: any[] = [];

  optionsMail = {
    asunto: 'Correo electrónico fallido',
    mail: 'ju.soto.sanchez@gmail.com',
    mensaje: 'Hubo un error al cambiar las opciones de los mails'
  }

  constructor(
    private productService: ProductService,
    private reservasService: ReservaService,
    private userService: UserService,
    private messageService: MessageService,
    private envioMailService: EnvioMailService,
    private insumos: InsumosService
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
  deleteSelectedReserva(reservaId) {
    this.reservaId = reservaId
    this.deleteUserDialog = true;
  }

  confirmDelete() {
    this.deleteUserDialog = false;
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Obtener los datos de la reserva antes de eliminarla
    this.reservasService.getReservaById(this.reservaId).subscribe(
      (reserva: any) => {
        const datosReservaEnvioMail = reserva;



        // Eliminar la reserva
        this.reservasService.deleteReservaById(this.reservaId).subscribe(
          response => {
            console.log({ msg: response });
            this.isLoading = false;
            this.deleteUserDialogConfirm = true;
            
            // Enviar correo al solicitante
            this.procesarReservaEnvioMail(datosReservaEnvioMail);

            // Recargar la grilla
            this.getReservasByUserId(this.users['Id']);
          },
          error => {
            console.error('Error en la eliminación de la reserva:', error);
            this.isLoading = false;
            this.errorMessage = 'Hubo un error al eliminar la reserva. Por favor, inténtelo de nuevo.';
          }
        );
      },
      error => {
        console.error('Error al obtener reserva por ID:', error);
        this.isLoading = false;
        this.errorMessage = 'Hubo un error al obtener los datos de la reserva. Por favor, inténtelo de nuevo.';
      }
    );
  }
  procesarReservaEnvioMail(datosReservaEnvioMail){
    //se envia correo a creador de la reserva
    const mensajeHTML = `
    <p>Estimado ${this.users['Nombres']},</p>
    <p>Junto con saludar, se informa la eliminación de la solicitud N°: ${datosReservaEnvioMail.Id}</p>
    <p>A continuación el detalle de la reserva eliminada:</p>
    <table border="1" style="border-collapse: collapse; width: 100%; margin-top: 20px;">
        <thead>
              <tr>
                  <th style="padding: 8px; text-align: left;">Nombre reserva</th>
                  <th style="padding: 8px; text-align: left;">N° de personas</th>
                  <th style="padding: 8px; text-align: left;">Comentarios</th>
                  <th style="padding: 8px; text-align: left;">Fecha reserva</th>
                  <th style="padding: 8px; text-align: left;">Nombre dependencia</th>
                  <th style="padding: 8px; text-align: left;">Insumos</th>
                  <th style="padding: 8px; text-align: left;">Horas seleccionadas</th>
                  <th style="padding: 8px; text-align: left;">Solicitante</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td style="padding: 8px;">${datosReservaEnvioMail.NombreReserva}</td>
                  <td style="padding: 8px;">${datosReservaEnvioMail.NPersonas}</td>
                  <td style="padding: 8px;">${datosReservaEnvioMail.Comentario}</td>
                  <td style="padding: 8px;">${new Date(datosReservaEnvioMail.FechaReserva).toLocaleDateString()}</td>
                  <td style="padding: 8px;">${datosReservaEnvioMail.NombreDependencia}</td>
                  <td style="padding: 8px;">${datosReservaEnvioMail.InsumosConcatenadosName}</td>
                  <td style="padding: 8px;">${datosReservaEnvioMail.HorariosContatenados}</td>
                  <td style="padding: 8px;">${this.users['Nombres']} ${this.users['Apellidos'] || ''}</td>
              </tr>
          </tbody>
    </table>
    <p>Atentamente,<br>Sistema de reserva de espacios</p>
    `;
    
    this.optionsMail = {
      asunto: 'Eliminación reserva - N°: '+ datosReservaEnvioMail.Id,
      mail: this.users['Email'],
      mensaje: mensajeHTML
    }
    this.envioMail();
  }

  procesarReservaEnvioMailInsumos(datosReservaEnvioMail, registrosUnicos){
    //se envia correo a dueños de insumos
    registrosUnicos.forEach(envioMails => {
      const mensajeHTML = `
      <p>Estimado ${this.users['Nombres']},</p>
      <p>Junto con saludar, se informa la eliminación de la solicitud N°: ${datosReservaEnvioMail.Id}</p>
      <p>A continuación el detalle de la reserva eliminada:</p>
      <table border="1" style="border-collapse: collapse; width: 100%; margin-top: 20px;">
          <thead>
                <tr>
                    <th style="padding: 8px; text-align: left;">Nombre reserva</th>
                    <th style="padding: 8px; text-align: left;">N° de personas</th>
                    <th style="padding: 8px; text-align: left;">Comentarios</th>
                    <th style="padding: 8px; text-align: left;">Fecha reserva</th>
                    <th style="padding: 8px; text-align: left;">Nombre dependencia</th>
                    <th style="padding: 8px; text-align: left;">Insumos</th>
                    <th style="padding: 8px; text-align: left;">Horas seleccionadas</th>
                    <th style="padding: 8px; text-align: left;">Solicitante</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding: 8px;">${datosReservaEnvioMail.NombreReserva}</td>
                    <td style="padding: 8px;">${datosReservaEnvioMail.NPersonas}</td>
                    <td style="padding: 8px;">${datosReservaEnvioMail.Comentario}</td>
                    <td style="padding: 8px;">${new Date(datosReservaEnvioMail.FechaReserva).toLocaleDateString()}</td>
                    <td style="padding: 8px;">${datosReservaEnvioMail.NombreDependencia}</td>
                    <td style="padding: 8px;">${datosReservaEnvioMail.InsumosConcatenadosName}</td>
                    <td style="padding: 8px;">${datosReservaEnvioMail.HorariosContatenados}</td>
                    <td style="padding: 8px;">${this.users['Nombres']} ${this.users['Apellidos'] || ''}</td>
                </tr>
            </tbody>
      </table>
      <p>Atentamente,<br>Sistema de reserva de espacios</p>
      `;
      
      this.optionsMail = {
        asunto: 'Eliminación de particiación en reserva - N°: '+ datosReservaEnvioMail.Id,
        mail: envioMails.Email,
        mensaje: mensajeHTML
      }
      this.envioMail();
    })
  }

  envioMail (){
    this.envioMailService.sendMail(this.optionsMail).subscribe(resp =>{
     console.log("Mensaje enviado"); 
    },
    error => {
      console.error('Error al enviar mai: ', error);
    });
  }

  editSelectedReserva(reservaId) {
    this.reservaId = reservaId
    this.editUserDialog = true;

    this.reservasService.getReservaById(this.reservaId).subscribe(
      (reserva: any) => {
        this.datosReservaEdit = reserva;
        console.log("datos: ", this.datosReservaEdit);
      },
      error => {
        console.error('Error al obtener reserva por ID:', error);
      }
    );
  }
}
