import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailReservaRoutingModule } from './detail-reserva.routing.module';
import { DetailReservaComponent } from './detail-reserva.component';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { RatingModule } from 'primeng/rating';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { FieldsetModule } from 'primeng/fieldset';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { ListboxModule } from 'primeng/listbox';

@NgModule({
    imports: [
        CommonModule,
        DetailReservaRoutingModule,
        CardModule,
        PanelModule,
        StepsModule,
        FormsModule,
        ToastModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        RippleModule,
        DropdownModule,
        RatingModule,
        FileUploadModule,
        ToolbarModule,
        InputTextareaModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        ProgressSpinnerModule,
        ProgressBarModule,
        FieldsetModule,
        MultiSelectModule,
        CalendarModule,
        ListboxModule
    ],
    declarations: [DetailReservaComponent]
})
export class DetailReservaModule { }
