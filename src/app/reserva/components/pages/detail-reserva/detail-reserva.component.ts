import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HorariosService } from 'src/app/reserva/service/Horarios.service';
import { ReservaService } from 'src/app/reserva/service/reserva.service';

@Component({
  selector: 'app-detail-reserva',
  templateUrl: './detail-reserva.component.html',
  styleUrl: './detail-reserva.component.scss'
})
export class DetailReservaComponent implements OnInit{
  reservaId: string;
  reserva: any[] = [];
  reservasInsumos: any[] = [];
  horariosUtilizados: any[] = [];
  fechaReserva: string;
  constructor(
    private route: ActivatedRoute,
    private reservaService: ReservaService,
    private horarioService: HorariosService
  ){  }
  ngOnInit(): void {
    this.reservaId = this.route.snapshot.paramMap.get('Id');
    this.getReservaById(this.reservaId);
    this.getReservasIdByInsumos(this.reservaId);
    this.getHorariosSeleccionados(this.reservaId);
  }
  getReservasIdByInsumos(reservaId: string) {
    this.reservaService.getReservaIdByInsumo(reservaId).subscribe(
      (reservas: any[]) => {
        this.reservasInsumos = reservas;
        //console.log("reservas Insumos por dependencia: ", this.reservasInsumos);
      },
      error => {
        console.error('Error al obtener reservas Insumos por dependencia:', error);
      }
    );
  }
  getReservaById(reservaId: string) {
    this.reservaService.getReservaDependenciaById(reservaId).subscribe(
      (reserva: any[]) => {
        this.reserva = reserva;
        //console.log("Reserva by idasd: ", this.reserva);
      },
      error => {
        console.error('error al obtener eserva by id:', error);
      }
    );
  }

  getHorariosSeleccionados(reservaId: any){
    this.horarioService.getHorariosUtilizados().subscribe(
      (horariosUtilizados: any[]) => {
        this.horariosUtilizados = horariosUtilizados.filter(elemento => {
          return elemento.IdReserva == reservaId;
        });
        const fechaSeleccionada = new Date(this.horariosUtilizados[0].FechaReserva); // Convertir a objeto Date si no lo es
        fechaSeleccionada.setHours(fechaSeleccionada.getHours() + 1);
        this.fechaReserva = this.formatDate(fechaSeleccionada); // Formatear la fecha
        
        //console.log("Horarios utilizados: ", this.fechaReserva);
      },
      error => {
        console.error('Error al obtener los horarios utilizados:', error);
      }
    );
  }

  formatDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
