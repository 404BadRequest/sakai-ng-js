import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSalasRoutingModule } from './admin-salas-routing.module';
import { AdminSalasComponent } from './admin-salas.component';

@NgModule({
    imports: [
        CommonModule,
        AdminSalasRoutingModule
    ],
    declarations: [AdminSalasComponent]
})
export class AdminSalasModule { }
