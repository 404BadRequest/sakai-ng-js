import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarRoutingModule } from './calendar.routing.module';
import { CalendarComponent } from './calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        CalendarRoutingModule,
        FullCalendarModule,
        DialogModule,
        FormsModule
    ],
    declarations: [CalendarComponent]
})
export class CalendarModule { }
