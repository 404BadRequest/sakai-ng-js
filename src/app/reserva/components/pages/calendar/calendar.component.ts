import { Component, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import esLocale from '@fullcalendar/core/locales/es-Us'
import listPlugin from '@fullcalendar/list'
import { HorariosService } from 'src/app/reserva/service/Horarios.service';
import { EventInput } from '@fullcalendar/core';
import { ReservaService } from 'src/app/reserva/service/reserva.service';
import { forkJoin } from 'rxjs';

@Component({
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit{

  eventDetails: any;
  infoUserDialog = false;
  horariosUtilizados: any[] = [];
  eventosCalendario: any[] = [];
  calendarEvents: EventInput[] = [];
  filtroEventos: string = 'todos';
  reservasInsumos: any [] = [];
  
  constructor(
    private horarioService : HorariosService,
    private reservaService : ReservaService
  ){}

  ngOnInit(): void {
    
    this.getHorariosUtilizados();
  }
  
  getHorariosUtilizados() {
    this.horarioService.getHorariosUtilizados().subscribe(
      (horarios: any[]) => {
        this.horariosUtilizados = horarios;
        this.mapHorariosToEvents(); // Mapear los horarios a eventos del calendario
        console.log("Horarios utilizados por dependencia: ", this.calendarEvents);
      },
      error => {
        console.error('Error al obtener los horarios utilizados por dependencia:', error);
      }
    );
  }

  getReservasIdByInsumos(reservaId: string) {
    return this.reservaService.getReservaIdByInsumo(reservaId);
  }

  mapHorariosToEvents() {
    this.calendarEvents = this.horariosUtilizados.map(horario => {
      const fechaSeleccionada = new Date(horario.FechaReserva);
      const fechaFormateada = this.formatDate(fechaSeleccionada);
      return {
        idReserva: horario.IdReserva,
        title: horario.NombreReserva, 
        dependencia: horario.NombreDependencia,
        start: fechaFormateada + "T" + horario.HoraSeleccionada, 
        end: '',
        color: horario.ColorDependencia,
        insumosDependencia: [] // Inicializar como un arreglo vacío
      };
    });
  
    // Obtener los insumos para cada reserva
    const requests = this.calendarEvents.map(evento => {
      return this.getReservasIdByInsumos(evento['idReserva']).toPromise();
    });
  
    // Esperar a que todas las solicitudes se completen usando Promise.all
    Promise.all(requests).then(results => {
      results.forEach((reservasInsumos, index) => {
        this.calendarEvents[index]['insumosDependencia'] = reservasInsumos.map((reservaInsumo: { NombreInsumo: any; }) => reservaInsumo.NombreInsumo);
      });
    }).catch(error => {
      console.error('Error al obtener los insumos por dependencia:', error);
    });
  }

  calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth', // Vista inicial del calendario (mes)
    locale: esLocale,
    firstDay: 1,
    selectable: true, // Permite seleccionar rangos de tiempo
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    dayMaxEvents: 2,
    eventColor: 'color',
    views: {
      dayGridMonth: { // Vista de mes
        type: 'dayGridMonth',
        buttonText: 'Mes'
      },
      timeGridWeek: { // Vista de semana
        type: 'timeGridWeek',
        buttonText: 'Semana'
      },
      listMonth: { // Vista de lista por mes
        type: 'listMonth',
        buttonText: 'Lista (Mes)'
      }
    },
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listMonth'
    },
  };

  formatDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } 

  handleDateSelect(selectInfo: any) {
    const title = prompt('Ingrese el título del evento:');
    const calendarApi = selectInfo.view.calendar;

    if (title) {
      calendarApi.addEvent({
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: any) {
    const idReserva = clickInfo.event.extendedProps.idReserva; // Obtener idReserva desde extendedProps
    const title = clickInfo.event.title;
    const dependencia = clickInfo.event.extendedProps.dependencia;
    const start = clickInfo.event.start;
    const end = clickInfo.event.end;
    const insumosDependencia = clickInfo.event.extendedProps.insumosDependencia;
    console.log("click info: ", insumosDependencia);
  
    this.eventDetails = {
      idReserva,
      title,
      dependencia,
      start,
      end,
      insumosDependencia
    };
    this.infoUserDialog = true;
  }

  // Método para manejar el cambio de selección en el select
  onChangeFiltroEventos() {
    if (this.filtroEventos === 'todos') {
      this.mapHorariosToEvents();
    } else if (this.filtroEventos === 'reservas') {
      // Filtrar los eventos según la opción seleccionada (por ejemplo, solo mostrar reservas)
      this.calendarEvents = this.calendarEvents.filter(evento => {
        // Lógica para filtrar eventos según la opción seleccionada
        return true; // Aquí debes implementar tu lógica de filtro
      });
    }
  }
}
