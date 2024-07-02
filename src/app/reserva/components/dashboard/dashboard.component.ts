// dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ReservaService } from '../../service/reserva.service';
import { UserService } from '../../service/user.service';
import { LoadingService } from '../../service/loading.service';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
    [x: string]: any;

    items!: MenuItem[];
    products!: Product[];
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;
    countReserva: any[];
    countReservaUltimaSemana: any[];
    usuariosActivos: any[];
    countReservaMeses: any[];
    loading$ = this.loadingService.loading$;

    mensajeAdvertencia: boolean = false;
    mensajeNoRegistrado: boolean = false;
    mensajeUsuarioNormal: boolean = false;
    constructor(
        private productService: ProductService, 
        public layoutService: LayoutService,
        private reservaService: ReservaService,
        private usuarioService: UserService,
        private loadingService: LoadingService,
        private userService: UserService
    ) {
        this.subscription = this.layoutService.configUpdate$
        .pipe(debounceTime(0))
        .subscribe((config) => {
            this.initChart();
        });
    }

    ngOnInit() {
        this.countReservas();
        this.countReservasUltimaSemana();
        this.usuariosActivosReserva();
        this.getReservasMeses();
        const sessionUser = JSON.parse(localStorage.getItem('sessionUser'));
        
        if(sessionUser!= null ) this.getUserByAzureId(sessionUser.azureId);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
    }
    
    getUserByAzureId(azureId: string) {
        //console.log(azureId);
        this.userService.getUserByAzureId(azureId).subscribe(
            (usersAzure: any[]) => {

                if (usersAzure['RolId'] === 1 || usersAzure['RolId'] === 3) {
                    this.mensajeAdvertencia = true;
                } else {
                    this.mensajeAdvertencia = false;
                }
                if(usersAzure!= null){
                    this.mensajeUsuarioNormal = true;
                }else{
                    this.mensajeNoRegistrado = true;
                }
            },
            error => {
                console.error('Error al obtener los usuarios por azure id:', error);
            }
        )
    }

    countReservas(){
        this.loadingService.setLoading(true);
        this.reservaService.getReservasCount().subscribe(
        (countResevas: any[]) => {
            this.countReserva = countResevas;
            this.loadingService.setLoading(false);
        },
        error => {
            console.error('Error al obtener el count de las reservas:', error);
            this.loadingService.setLoading(false);
        }
        );
    }

    countReservasUltimaSemana(){
        this.loadingService.setLoading(true);
        this.reservaService.getReservasCount7dias().subscribe(
        (countResevasUltimaSemana: any[]) => {
            this.countReservaUltimaSemana = countResevasUltimaSemana;
            this.loadingService.setLoading(false);
        },
        error => {
            console.error('Error al obtener el count de las reservas de la última semana:', error);
            this.loadingService.setLoading(false);
        }
        );
    }

    usuariosActivosReserva(){
        this.loadingService.setLoading(true);
        this.usuarioService.getUsersCount().subscribe(
        (countUsuarios: any[]) => {
            this.usuariosActivos = countUsuarios;
            this.loadingService.setLoading(false);
        },
        error => {
            console.error('Error al obtener el count de los usuarios activos:', error);
            this.loadingService.setLoading(false);
        }
        );
    }

    getReservasMeses(){
        this.reservaService.getReservasCountMeses().subscribe(
            (countResevasMeses: any[]) => {
            // Crear un arreglo con todos los meses del año
            const todosLosMeses = Array.from({ length: 12 }, (_, i) => i + 1);
    
            // Iterar sobre cada mes y verificar si está en el arreglo original
            const reservasConTodosLosMeses = todosLosMeses.map(mes => {
                const reserva = countResevasMeses.find(r => r.mes === mes);
                return reserva || { año: new Date().getFullYear(), mes, total_reservas: 0 };
            });
            // Ordenar el arreglo por mes
            this.countReservaMeses = reservasConTodosLosMeses.sort((a, b) => a.mes - b.mes);
            this.initChart();
            },
            error => {
            console.error('Error al obtener el count de las reservas de los meses:', error);
            }
        );
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        
        const mesesLabels = this.countReservaMeses.map(reserva => {
            return this.nombreMes(reserva.mes); 
        });

        const totalesReservas = this.countReservaMeses.map(reserva => reserva.total_reservas);
        // Definir un array de colores para las barras
        const coloresBarras = [
            'rgb(255, 99, 132)',    // Rojo
            'rgb(54, 162, 235)',    // Azul
            'rgb(255, 205, 86)',    // Amarillo
            'rgb(75, 192, 192)',    // Verde
            // Agrega más colores según sea necesario
        ];

        // Generar un color aleatorio para cada barra
        const coloresAleatorios = Array.from({ length: totalesReservas.length }, () => {
            const indiceColor = Math.floor(Math.random() * coloresBarras.length);
            return coloresBarras[indiceColor];
        });
        this.chartData = {
            labels: mesesLabels,
            datasets: [
                {
                    label: 'Reservas ingresadas',
                    data: totalesReservas,
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }
    nombreMes(numeroMes: number): string {
        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
    
        const indiceMes = numeroMes - 1;
    
        if (indiceMes >= 0 && indiceMes < meses.length) {
            return meses[indiceMes];
        } else {
            return 'Mes inválido';
        }
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
