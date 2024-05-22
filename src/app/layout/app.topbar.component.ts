import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string,
  displayName?: string
}

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit{

    items!: MenuItem[];
    loginDisplay: boolean = false;
    isIframe = false;
    private readonly _destroying$ = new Subject<void>();
    profile!: ProfileType;
    userProfile: string = "";
    loading = [false, false, false, false];
    users: any[] = [];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;
    

    constructor(
        @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
        private authService: MsalService,
        private msalBroadcastService: MsalBroadcastService,
        public layoutService: LayoutService,
        private http: HttpClient,
        private router: Router
    ) { }

    ngOnInit(): void {
      
        this.isIframe = window !== window.parent && !window.opener;
    
        this.msalBroadcastService.inProgress$
          .pipe(
            filter((status: InteractionStatus) => status === InteractionStatus.None),
            takeUntil(this._destroying$)
          )
          .subscribe(() => {
            this.setLoginDisplay();
            if(this.loginDisplay){
                this.getProfile();
            }
          });
    }
      
      setLoginDisplay() {
        this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
      }
    
      login() {
        if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
          if (this.msalGuardConfig.authRequest) {
            this.authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
              .subscribe((response: AuthenticationResult) => {
                this.authService.instance.setActiveAccount(response.account);
              });
          } else {
            this.authService.loginPopup()
              .subscribe((response: AuthenticationResult) => {
                this.authService.instance.setActiveAccount(response.account);
              });
          }
        } else {
          if (this.msalGuardConfig.authRequest) {
            this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
          } else {
            this.authService.loginRedirect();
          }
        }
      }
    
      logout() {
        if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
          this.authService.logoutPopup({
            postLogoutRedirectUri: "/",
            mainWindowRedirectUri: "/"
          });
        } else {
          this.authService.logoutRedirect({
            postLogoutRedirectUri: "/",
          });
        }
      }
    
      ngOnDestroy(): void {
        this._destroying$.next(undefined);
        this._destroying$.complete();
      }

      getProfile() {
        this.http.get(GRAPH_ENDPOINT)
          .subscribe(profile => {
            this.profile = profile;
            this.userProfile = this.profile.displayName;
            localStorage.setItem('sessionUser', JSON.stringify({ azureId: this.profile.id, userPrincipalName: this.profile.userPrincipalName}));
            if(!this.router.url.includes('/dashboard')){
              this.router.navigate(['/dashboard']);
              window.location.reload();
            }
          });
      }
    load(index: number) {
        this.loading[index] = true;
        setTimeout(() => this.loading[index] = false, 1000);
        localStorage.removeItem('sessionUser');
    }
}
