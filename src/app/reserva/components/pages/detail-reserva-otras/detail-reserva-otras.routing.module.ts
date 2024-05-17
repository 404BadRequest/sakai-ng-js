import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DetailReservaOtrasComponent } from './detail-reserva-otras.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DetailReservaOtrasComponent }
    ])],
    exports: [RouterModule]
})
export class DetailReservaOtrasRoutingModule { }