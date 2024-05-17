import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./crud/crud.module').then(m => m.CrudModule), canActivate: [MsalGuard] },
        { path: 'timeline', loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule), canActivate: [MsalGuard] },
        { path: 'admin-salas', loadChildren: () => import('./admin-salas/admin-salas.module').then(m => m.AdminSalasModule), canActivate: [MsalGuard] },
        { path: 'admin-usuarios', loadChildren: () => import('./admin-usuarios/admin-usuarios.module').then(m => m.AdminUsuariosModule), canActivate: [MsalGuard] },
        { path: 'new-reserva', loadChildren: () => import('./new-reserva/new-reserva.module').then(m => m.NewResevaModule), canActivate: [MsalGuard] },
        { path: 'calendar', loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule), canActivate: [MsalGuard] },
        { path: 'mis-reservas', loadChildren: () => import('./mis-reservas/mis-reservas.module').then(m => m.MisReservasModule), canActivate: [MsalGuard] },
        { path: 'mis-aprobaciones', loadChildren: () => import('./mis-aprobaciones/mis-aprobaciones.module').then(m => m.MisAprobacionesModule), canActivate: [MsalGuard] },
        { path: 'detail-reserva/:Id', loadChildren: () => import('./detail-reserva/detail-reserva.module').then(m => m.DetailReservaModule), canActivate: [MsalGuard] },
        { path: 'detail-reserva-otras/:Id', loadChildren: () => import('./detail-reserva-otras/detail-reserva-otras.module').then(m => m.DetailReservaOtrasModule), canActivate: [MsalGuard] },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
