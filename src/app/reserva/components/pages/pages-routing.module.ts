import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./crud/crud.module').then(m => m.CrudModule) },
        { path: 'timeline', loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule) },
        { path: 'admin-salas', loadChildren: () => import('./admin-salas/admin-salas.module').then(m => m.AdminSalasModule) },
        { path: 'admin-usuarios', loadChildren: () => import('./admin-usuarios/admin-usuarios.module').then(m => m.AdminUsuariosModule) },
        { path: 'new-reserva', loadChildren: () => import('./new-reserva/newreserva.module').then(m => m.NewResevaModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
