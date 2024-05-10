import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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

  
  
  const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';
  const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

  export function loggerCallback(logLevel: LogLevel, message: string) {
    console.log(message);
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
        redirectUri: 'https://localhost:4200/#/dashboard',
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
    imports: [
        CommonModule,
        LoginRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        HttpClientModule,
        MsalModule
    ],
    declarations: [LoginComponent],
    providers: [
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
      ],
      bootstrap: [LoginComponent, MsalRedirectComponent]
})
export class LoginModule { }
