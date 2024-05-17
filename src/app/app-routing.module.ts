import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './reserva/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { MsalGuard } from '@azure/msal-angular';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./reserva/components/pages/inicio/inicio.module').then(m => m.InicioModule) },
                    { path: 'dashboard', loadChildren: () => import('./reserva/components/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [MsalGuard] },
                    { path: 'uikit', loadChildren: () => import('./reserva/components/uikit/uikit.module').then(m => m.UIkitModule), canActivate: [MsalGuard] },
                    { path: 'utilities', loadChildren: () => import('./reserva/components/utilities/utilities.module').then(m => m.UtilitiesModule), canActivate: [MsalGuard] },
                    { path: 'documentation', loadChildren: () => import('./reserva/components/documentation/documentation.module').then(m => m.DocumentationModule), canActivate: [MsalGuard] },
                    { path: 'blocks', loadChildren: () => import('./reserva/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule), canActivate: [MsalGuard] },
                    { path: 'pages', loadChildren: () => import('./reserva/components/pages/pages.module').then(m => m.PagesModule), canActivate: [MsalGuard] },

                ]
            },
            { path: 'auth', loadChildren: () => import('./reserva/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./reserva/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/dashboard' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
