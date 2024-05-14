import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './reserva/components/notfound/notfound.component';
import { ProductService } from './reserva/service/product.service';
import { CountryService } from './reserva/service/country.service';
import { CustomerService } from './reserva/service/customer.service';
import { EventService } from './reserva/service/event.service';
import { IconService } from './reserva/service/icon.service';
import { NodeService } from './reserva/service/node.service';
import { PhotoService } from './reserva/service/photo.service';
import { UserService } from './reserva/service/user.service';
import { RolService } from './reserva/service/rol.service';
import { ParametroDetalleService } from './reserva/service/parametroDetalle.service';
import { DependenciaService } from './reserva/service/dependencia.service';
import { InsumosService } from './reserva/service/insumos.service';
import { ReservaService } from './reserva/service/reserva.service';
import { ReservaHorariosService } from './reserva/service/reservaHorarios.service';
import { HorariosService } from './reserva/service/Horarios.service';
import {
    IPublicClientApplication,
    PublicClientApplication,
    BrowserCacheLocation,
    LogLevel,
    InteractionType,
  } from '@azure/msal-browser';
  import {
    MSAL_INSTANCE,
    MSAL_INTERCEPTOR_CONFIG,
    MsalInterceptorConfiguration,
    MSAL_GUARD_CONFIG,
    MsalGuardConfiguration,
    MsalBroadcastService,
    MsalService,
    MsalGuard,
    MsalRedirectComponent,
    MsalModule,
    MsalInterceptor,
  } from '@azure/msal-angular';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';

  
  
  const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';
  const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

  export function loggerCallback(logLevel: LogLevel, message: string) {
    //console.log(message);
  }

  export function MSALInstanceFactory(): IPublicClientApplication {
    return new PublicClientApplication({
      /*auth: {
        clientId: 'f9432d3e-1e87-461f-bba7-0fa1db5a4730',
        authority: 'https://login.microsoftonline.com/e5835003-ab1f-4e4b-8020-c5886fbc8369',
        redirectUri: 'https://localhost:4200',
      },*/
      auth: {
        clientId: '20dea582-0e77-42d5-b802-975107d904ae',
        authority: 'https://login.microsoftonline.com/11bc7339-c6ee-4268-9071-46778e253099',
        redirectUri: 'http://localhost:4200',
      },
      cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
        storeAuthStateInCookie: isIE, // set to true for IE 11
      },
      system: {
        loggerOptions: {
          loggerCallback,
          logLevel: LogLevel.Info,
          piiLoggingEnabled: false,
        },
      },
    });
  }
  export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
    const protectedResourceMap = new Map<string, Array<string>>();
    protectedResourceMap.set(GRAPH_ENDPOINT, ['user.read']);
  
    return {
      interactionType: InteractionType.Redirect,
      protectedResourceMap,
    };
  }
  
  export function MSALGuardConfigFactory(): MsalGuardConfiguration {
    return {
      interactionType: InteractionType.Redirect,
      authRequest: {
        scopes: ['user.read'],
      },
    };
  }
@NgModule({
    declarations: [
        AppComponent, NotfoundComponent
    ],
    imports: [
        CommonModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        AppRoutingModule,
        AppLayoutModule,
        HttpClientModule,
        MsalModule,
    ],
    providers: [
        { 
            provide: LocationStrategy, 
            useClass: HashLocationStrategy 
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MsalInterceptor,
            multi: true,
          },
          {
            provide: MSAL_INSTANCE,
            useFactory: MSALInstanceFactory,
          },
          {
            provide: MSAL_GUARD_CONFIG,
            useFactory: MSALGuardConfigFactory,
          },
          {
            provide: MSAL_INTERCEPTOR_CONFIG,
            useFactory: MSALInterceptorConfigFactory,
          },
          MsalService,
          MsalGuard,
          MsalBroadcastService,
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService, UserService, RolService, 
        ParametroDetalleService, DependenciaService, InsumosService, ReservaService, 
        ReservaHorariosService, HorariosService
    ],
    bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
