import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DetailReservaComponent } from './detail-reserva.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DetailReservaComponent }
    ])],
    exports: [RouterModule]
})
export class DetailReservaRoutingModule { }