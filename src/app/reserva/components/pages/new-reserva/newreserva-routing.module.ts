import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewResevaComponent } from './newreserva.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: NewResevaComponent }
    ])],
    exports: [RouterModule]
})
export class NewResevaRoutingModule { }
