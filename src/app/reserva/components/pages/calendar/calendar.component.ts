import { Component, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import esLocale from '@fullcalendar/core/locales/es-Us'
import listPlugin from '@fullcalendar/list'
import { HorariosService } from 'src/app/reserva/service/Horarios.service';
import { EventInput } from '@fullcalendar/core';
import { ReservaService } from 'src/app/reserva/service/reserva.service';
import { forkJoin } from 'rxjs';
import { SelectItem } from 'primeng/api/selectitem';
import { InsumosService } from 'src/app/reserva/service/insumos.service';
import { DependenciaService } from 'src/app/reserva/service/dependencia.service';

@Component({
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit{
  
  eventDetails: any;
  infoUserDialog = false;
  horariosUtilizados: any[] = [];
  horariosUtilizadosByDependenciaId: any[] = [];
  eventosCalendario: any[] = [];
  calendarEvents: EventInput[] = [];
  filtroEventos: string = 'todos';
  reservasInsumos: any [] = [];
  filtroInsumos: string = 'todos';
  filtroDependencias: string = 'todos';
  dependencias: SelectItem[] = [];
  insumos: SelectItem[] = [];

  constructor(
    private horarioService : HorariosService,
    private reservaService : ReservaService,
    private insumoService: InsumosService,
    private depndenciaService: DependenciaService
  ){}

  ngOnInit(): void {
    this.getHorariosUtilizados();
    this.getInsumos();
    this.getDependencias();
  }
  
  getInsumos(){
    this.insumoService.getInsumosApiJs().subscribe(
      (insumos: any[]) => {
        this.insumos = insumos.map(insumo => {
          return {
            label: insumo.Nombre, // El nombre de la dependencia
            value: { 
              id: insumo.Id, // El ID de la dependencia
              name: insumo.Nombre, // El nombre de la dependencia
              code: insumo.Id // El código de la dependencia
            }
          };
        });
      },
      error => {
        console.error('Error al obtener los insumos:', error);
      }
    );
  }

  getDependencias(){
    this.depndenciaService.getDependenciasApiJs().subscribe(
      (dependencias: any[]) => {
        this.dependencias = dependencias.map(dependencia => {
          return {
            label: dependencia.Nombre, // El nombre de la dependencia
            value: { 
              id: dependencia.Id, // El ID de la dependencia
              name: dependencia.Nombre, // El nombre de la dependencia
              code: dependencia.Id // El código de la dependencia
            }
          };
        });
      },
      error => {
        console.error('Error al obtener los insumos:', error);
      }
    );
  }

  getHorariosUtilizados() {
    this.horarioService.getHorariosUtilizados().subscribe(
      (horarios: any[]) => {
        this.horariosUtilizados = horarios;
        this.mapHorariosToEvents(); // Mapear los horarios a eventos del calendario
        //console.log("Horarios utilizados por dependencia: ", this.calendarEvents);
      },
      error => {
        console.error('Error al obtener los horarios utilizados por dependencia:', error);
      }
    );
  }

  getReservasIdByInsumos(reservaId: string) {
    return this.reservaService.getReservaIdByInsumo(reservaId);
  }

  getHorariosUtilizadosByDependenciaId(dependenciaId: string) {
    this.horarioService.getHorariosUtilizadosByDependenciaId(dependenciaId).subscribe(
      (horarios: any[]) => {
        this.horariosUtilizadosByDependenciaId = horarios;
        this.mapHorariosToEvents(dependenciaId); // Mapear los horarios a eventos del calendario
        //console.log("Horarios utilizados por dependencia: ", this.calendarEvents);
      },
      error => {
        console.error('Error al obtener los horarios utilizados por dependencia:', error);
      }
    );
  }

  mapHorariosToEvents(dependenciaId?: string, insumoid?: string) {
    let horariosFiltrados = this.horariosUtilizados;
    if (dependenciaId) {
        horariosFiltrados = horariosFiltrados.filter(horario => horario.DependenciaId === dependenciaId);
    }
    if (insumoid) {
        horariosFiltrados = horariosFiltrados.filter(horario => horario.InsumosConcatenados.includes(insumoid));
    }

    // Agrupar horarios por IdReserva
    const horariosAgrupados = horariosFiltrados.reduce((acc: { [key: number]: any[] }, horario) => {
        if (!acc[horario.IdReserva]) {
            acc[horario.IdReserva] = [];
        }
        acc[horario.IdReserva].push(horario);
        return acc;
    }, {});

    // Convertir horas a minutos
    const timeToMinutes = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // Convertir minutos a horas
    const minutesToTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    };

    // Crear eventos fusionados
    this.calendarEvents = Object.values(horariosAgrupados).map((grupo: any[]) => {
        const horas = grupo.map(horario => timeToMinutes(horario.HoraSeleccionada));
        const HoraSeleccionadaInicio = minutesToTime(Math.min(...horas));
        const HoraSeleccionadaFin = minutesToTime(Math.max(...horas) + 30); // adding 30 minutes to the last hour to get the correct end time
        
        const HorasSeleccionadas = grupo.map(horario => horario.HoraSeleccionada);
        
        const horario = grupo[0];
        const fechaSeleccionada = new Date(horario.FechaReserva);
        const fechaFormateada = this.formatDate(fechaSeleccionada);

        return {
            idReserva: horario.IdReserva,
            title: horario.NombreReserva + " - " + horario.NombreSolicitante,
            dependencia: horario.NombreDependencia,
            start: fechaFormateada + "T" + HoraSeleccionadaInicio,
            end: fechaFormateada + "T" + HoraSeleccionadaFin,
            color: horario.ColorDependencia,
            insumosDependencia: horario.InsumosConcatenadosName,
            nombreSolicitante: horario.NombreSolicitante,
            HorasSeleccionadas: HorasSeleccionadas
        };
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
    dayMaxEvents: 6,
    eventColor: 'color',
    views: {
      dayGridMonth: { // Vista de mes
        type: 'dayGridMonth',
        buttonText: 'Mes'
      },
      listMonth: { // Vista de lista por mes
        type: 'listMonth',
        buttonText: 'Lista (Mes)'
      }
    },
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listMonth'
    },
  }

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
    const nombreSolicitante = clickInfo.event.extendedProps.nombreSolicitante;
    const HorasSeleccionadas = clickInfo.event.extendedProps.HorasSeleccionadas;
    //console.log("click info: ", insumosDependencia);
  
    this.eventDetails = {
      idReserva,
      title,
      dependencia,
      start,
      end,
      insumosDependencia,
      nombreSolicitante,
      HorasSeleccionadas
    };
    this.infoUserDialog = true;
  }

  // Método para manejar el cambio de selección en el select
  onChangeFiltroInsumos(selectedInsumo: any) {
    if(selectedInsumo){
      const insumoId= selectedInsumo.id;
      this.mapHorariosToEvents(null, insumoId);
    }
  }
  onChangeFiltroDependencias(selectedDependencia: any) {
    if(selectedDependencia){
      const dependenciaId= selectedDependencia.id;
      this.mapHorariosToEvents(dependenciaId);
    }
  }
  onClearDropdown(){
    this.getHorariosUtilizados();
  }
}
