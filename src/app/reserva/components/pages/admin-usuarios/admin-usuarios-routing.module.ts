import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminUsuariosComponent } from './admin-usuarios.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: AdminUsuariosComponent }
    ])],
    exports: [RouterModule]
})
export class AdminUsuariosRoutingModule { }
