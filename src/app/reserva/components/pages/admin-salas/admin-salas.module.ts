import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSalasRoutingModule } from './admin-salas-routing.module';
import { AdminSalasComponent } from './admin-salas.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';

@NgModule({
    imports: [
        CommonModule,
        AdminSalasRoutingModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        ToggleButtonModule,
        RippleModule,
        MultiSelectModule,
        DropdownModule,
        ProgressBarModule,
        ToastModule,
        SliderModule,
        RatingModule
    ],
    declarations: [AdminSalasComponent]
})
export class AdminSalasModule { }
