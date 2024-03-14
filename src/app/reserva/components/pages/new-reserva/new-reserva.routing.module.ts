import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewResevaComponent } from './new-reserva.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: NewResevaComponent }
    ])],
    exports: [RouterModule]
})
export class NewResevaRoutingModule { }
