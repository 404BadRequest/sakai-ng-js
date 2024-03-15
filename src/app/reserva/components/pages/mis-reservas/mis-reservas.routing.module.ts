import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MisReservasComponent } from './mis-reservas.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: MisReservasComponent }
    ])],
    exports: [RouterModule]
})
export class MisReservasRoutingModule { }