import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarRoutingModule } from './calendar.routing.module';
import { CalendarComponent } from './calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';

@NgModule({
    imports: [
        CommonModule,
        CalendarRoutingModule,
        FullCalendarModule,
        DialogModule,
        FormsModule,
        MultiSelectModule,
        DropdownModule,
        TableModule
    ],
    declarations: [CalendarComponent]
})
export class CalendarModule { }
