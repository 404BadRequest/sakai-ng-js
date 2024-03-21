import { Component, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import esLocale from '@fullcalendar/core/locales/es-Us'
import listPlugin from '@fullcalendar/list'

@Component({
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

  eventDetails: any;
  infoUserDialog = false;
  
  calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth', // Vista inicial del calendario (mes)
    locale: esLocale,
    firstDay: 1,
    selectable: true, // Permite seleccionar rangos de tiempo
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
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

  calendarEvents = [ // Define los eventos del calendario
    { title: 'Reserva laboratorio de computación', date: '2024-03-20T10:00:00', end: '2024-03-20T11:00:00' },
    { title: 'Reserva laboratorio de computación', date: '2024-03-20T15:00:00', end: '2024-03-20T17:00:00' },
    { title: 'Reserva sala 202', date: '2024-03-19T14:30:00', end: '2024-03-19T17:00:00' }
  ];

  handleDateSelect(selectInfo: any) {
    const title = prompt('Ingrese el título del evento:');
    const calendarApi = selectInfo.view.calendar;

    if (title) {
      calendarApi.addEvent({
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr, // La hora de finalización se calcula automáticamente sumando 3 horas a la hora de inicio
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: any) {
    this.eventDetails = {
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end
    };
    this.infoUserDialog = true;
  }
}
