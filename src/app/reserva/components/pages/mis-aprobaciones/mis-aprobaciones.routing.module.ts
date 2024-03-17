import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MisAprobacionesComponent } from './mis-aprobaciones.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: MisAprobacionesComponent }
    ])],
    exports: [RouterModule]
})
export class MisAprobacionesRoutingModule { }