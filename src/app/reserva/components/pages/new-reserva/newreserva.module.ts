import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewResevaRoutingModule } from './newreserva-routing.module';
import { NewResevaComponent } from './newreserva.component';

@NgModule({
    imports: [
        CommonModule,
        NewResevaRoutingModule
    ],
    declarations: [NewResevaComponent]
})
export class NewResevaModule { }
