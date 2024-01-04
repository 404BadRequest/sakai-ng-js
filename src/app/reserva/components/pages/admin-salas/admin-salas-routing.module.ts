import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminSalasComponent } from './admin-salas.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: AdminSalasComponent }
    ])],
    exports: [RouterModule]
})
export class AdminSalasRoutingModule { }
