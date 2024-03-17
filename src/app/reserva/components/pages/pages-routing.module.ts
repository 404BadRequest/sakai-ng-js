import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./crud/crud.module').then(m => m.CrudModule) },
        { path: 'timeline', loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule) },
        { path: 'admin-salas', loadChildren: () => import('./admin-salas/admin-salas.module').then(m => m.AdminSalasModule) },
        { path: 'admin-usuarios', loadChildren: () => import('./admin-usuarios/admin-usuarios.module').then(m => m.AdminUsuariosModule) },
        { path: 'new-reserva', loadChildren: () => import('./new-reserva/new-reserva.module').then(m => m.NewResevaModule) },
        { path: 'calendar', loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule) },
        { path: 'mis-reservas', loadChildren: () => import('./mis-reservas/mis-reservas.module').then(m => m.MisReservasModule) },
        { path: 'mis-aprobaciones', loadChildren: () => import('./mis-aprobaciones/mis-aprobaciones.module').then(m => m.MisAprobacionesModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
