import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { UserService } from '../reserva/service/user.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    visible: boolean = false;
    users: any[] = [];
    otrasReservas: boolean= false;
    constructor(
        public layoutService: LayoutService,
        private userService: UserService
    ) { }

    ngOnInit() {
        const sessionUser = JSON.parse(localStorage.getItem('sessionUser'));
        
        if(sessionUser != null) this.visible=true;

        if(sessionUser!= null )this.getUserByAzureId(sessionUser.azureId);

        this.model = [
            {
                label: 'Inicio',
                items: [
                    { 
                        label: 'Dashboard', 
                        icon: 'pi pi-fw pi-home', 
                        routerLink: ['/dashboard'],
                        visible: this.visible
                     }
                ]
            },
            {
                label: 'Reserva',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Nueva reserva',
                        icon: 'pi pi-fw pi-plus',
                        routerLink: ['/pages/new-reserva'],
                        visible: this.visible
                    },
                    {
                        label: 'Mis reservas',
                        icon: 'pi pi-fw pi-folder-open',
                        routerLink: ['/pages/mis-reservas'],
                        visible: this.visible
                    },
                    {
                        label: 'Otras reservas',
                        icon: 'pi pi-fw pi-check-square',
                        routerLink: ['/pages/mis-aprobaciones'],
                        visible: this.otrasReservas
                    },
                    {
                        label: 'Calendario',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/pages/calendar'],
                        visible: this.visible
                    },
                ]
            },
        ];
    }

    getUserByAzureId(azureId: string) {
        this.userService.getUserByAzureId(azureId).subscribe(
            (usersAzure: any[]) => {
                this.users = usersAzure;
                if (usersAzure['RolId'] === 1 || usersAzure['RolId'] === 3) {
                    this.otrasReservas = true;
                } else {
                    this.otrasReservas = false;
                }
                this.actualizarMenu();
            },
            error => {
                console.error('Error al obtener los usuarios por azure id:', error);
            }
        )
    }
    
    actualizarMenu() {
        this.model = [
            {
                label: 'Inicio',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/dashboard'],
                        visible: this.visible
                    }
                ]
            },
            {
                label: 'Reserva',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Nueva reserva',
                        icon: 'pi pi-fw pi-plus',
                        routerLink: ['/pages/new-reserva'],
                        visible: this.visible
                    },
                    {
                        label: 'Mis reservas',
                        icon: 'pi pi-fw pi-folder-open',
                        routerLink: ['/pages/mis-reservas'],
                        visible: this.visible
                    },
                    {
                        label: 'Otras reservas',
                        icon: 'pi pi-fw pi-check-square',
                        routerLink: ['/pages/mis-aprobaciones'],
                        visible: this.otrasReservas
                    },
                    {
                        label: 'Calendario',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/pages/calendar'],
                        visible: this.visible
                    },
                ]
            },
        ];
    }
}
