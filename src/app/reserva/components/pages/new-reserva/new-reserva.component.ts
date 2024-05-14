import { ChangeDetectorRef, Component, LOCALE_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { HorariosService } from 'src/app/reserva/service/Horarios.service';
import { DependenciaService } from 'src/app/reserva/service/dependencia.service';
import { InsumosService } from 'src/app/reserva/service/insumos.service';
import { ParametroDetalleService } from 'src/app/reserva/service/parametroDetalle.service';
import { ReservaService } from 'src/app/reserva/service/reserva.service';
import { ReservaHorariosService } from 'src/app/reserva/service/reservaHorarios.service';
import { SelectedDataService } from 'src/app/reserva/service/selected-data.service';

interface Hora {
  hora: number;
  minuto: number;
  seleccionado: boolean;
}

interface Horario {
  Id: number;
  TipoHorarioId: number;
  Horario: string;
  seleccionado: boolean;
  FechaReserva: string;
  HorarioId: number;
  seleccionadoInLine: boolean;

  //TODO: Se debe limpiar el botón seleecionadoInline para losc abios de día y cambios de salas.
}

@Component({
  templateUrl: './new-reserva.component.html',
  providers: [MessageService]
})
export class NewResevaComponent implements OnInit { 

  horasDelDia: Horario[] = [];
  gruposDeHoras: any[] = []; 
  horasSeleccionadas: Horario[] = [];

  cols: any[];
  items: MenuItem[];
  texto: string;
  activeIndex: number = 0;
  nombreReserva: string;
  numeroPersonas: string;
  motivoReserva: string;
  comentarios: string;
  dropdownItemsInsumos: any[] = [];
  dropdownItemsDependencias: any[] = []; 
  parametroInsumo: string = "1";
  selectedItems: any[] = [];
  selectedItemsDependencias: any[] = [];
  selectedDate: Date;
  dateCalendar: Date;
  minDate: Date;
  mostrarContenido: boolean = true;
  guardandoReserva: boolean = false;
  horariosContinuos: any[] = [];
  horariosUtilizados: any[] = [];
  horaOcupada: string[] = [];

  
  constructor(
    private parametroDetalle: ParametroDetalleService,
    private insumos: InsumosService,
    private selectedDataService: SelectedDataService,
    private messageService: MessageService,
    private dependencia: DependenciaService,
    private reservaService : ReservaService,
    private router: Router,
    private reservaInsumoService: InsumosService,
    private reservaHorariosService: ReservaHorariosService,
    private horariosService: HorariosService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.items = [
      { label: 'Información', command: () => this.activateStep(0), active: true },
      { label: 'Insumos / Dependencia', command: () => this.activateStep(1) },
      { label: 'Horario', command: () => this.activateStep(2) },
      { label: 'Confirmación', command: () => this.activateStep(3) }
    ];
    this.getHorariosContinuo();
    this.getHorariosSeleccionados();
    this.getInsumos();
    this.getDependencias();
    this.dropdownItemsInsumos = this.selectedDataService.getSelectedData();
    
    // Obtener la fecha actual
    const fechaActual = new Date();
    // Agregar un día a la fecha actual
    fechaActual.setDate(fechaActual.getDate() + 1);
    this.minDate = fechaActual;

    this.cols = [
      { field: 'hora', header: 'Hora' },
      { field: 'seleccionado', header: 'Seleccionar' }
    ];

  }
  getHorariosContinuo(){
    this.horariosService.getHorariosContinuo().subscribe(
      (horarios: any[]) => {
        // Si los horarios se obtienen correctamente, los asignamos y luego los agrupamos
        this.horasDelDia = horarios;
        this.gruposDeHoras = this.chunkArray(this.horasDelDia, 3);
        //console.log('Horarios obtenidos:', this.gruposDeHoras);
      },
      error => {
        console.error('Error al obtener los horarios:', error);
      }
    );
  }

  getHorariosSeleccionados(){
    this.horariosService.getHorariosUtilizados().subscribe(
      (horariosUtilizados: any[]) => {
        this.horariosUtilizados = horariosUtilizados;
      },
      error => {
        console.error('Error al obtener los horarios utilizados:', error);
      }
    );
  }

  chunkArray(array: any[], size: number) {
    // Lógica para dividir el array en sub-arrays de tamaño especificado
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
  }
  getInsumos(): void {
    this.insumos.getInsumosApiJs()
      .subscribe(data => {
        // Actualiza this.dropdownItemsRols con los roles obtenidos
        this.dropdownItemsInsumos = data.map(insumo => ({ name: insumo.Nombre, code: insumo.Id }));
      }, error => {
        console.error('Error en la solicitud de insumos:', error);
    });
  }

  getDependencias(): void {
    this.dependencia.getDependenciasApiJs().subscribe(data => {
      // Actualiza this.dropdownItemsRols con los roles obtenidos
      this.dropdownItemsDependencias = data.map(dependencia => ({ name: dependencia.Nombre, code: dependencia.Id }));
    }, error => {
      console.error('Error en la solicitud de Dependencias:', error);
    });
  }
  
  activateStep(index: number) {
    this.items.forEach((item, i) => {
      item['active'] = i === index;
    });
  }

  previousStep() {
    const currentIndex = this.items.findIndex(item => item['active']);
    if (currentIndex > 0) {
      this.items[currentIndex]['active'] = false;
      this.items[currentIndex - 1]['active'] = true;
    }
    this.activeIndex = (this.activeIndex > 0) ? this.activeIndex - 1 : 0;
  }
  
  nextStep() {
    
    if (this.items[this.activeIndex]['label'] === 'Información') {
      if (!this.nombreReserva || !this.numeroPersonas || !this.comentarios) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos para continuar', life: 3000 });
          return; // Detener el proceso de pasar al siguiente paso
      }
    }else if(this.items[this.activeIndex]['label'] === 'Insumos / Dependencia'){
      if(!this.selectedItems || this.selectedItems.length === 0 || !this.selectedItemsDependencias || this.selectedItemsDependencias.length === 0){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos para continuar', life: 3000 });
        return; // Detener el proceso de pasar al siguiente paso
      }
      //se restaura calendario y se limpian los seleccione que quedaron paso anterior.
      this.dateCalendar = null;
      this.limpiarGrupoFechas();
      this.selectedDate = null;
      this.horasSeleccionadas = [];
    }else if(this.items[this.activeIndex]['label'] === 'Horario'){
      if(!this.selectedDate || this.horasSeleccionadas.length === 0){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor complete todos los campos para continuar', life: 3000 });
        return; // Detener el proceso de pasar al siguiente paso
      }
    }
    const currentIndex = this.items.findIndex(item => item['active']);
    if (currentIndex < this.items.length - 1) {
      this.items[currentIndex]['active'] = false;
      this.items[currentIndex + 1]['active'] = true;
    }
    this.activeIndex = (this.activeIndex < this.items.length - 1) ? this.activeIndex + 1 : this.items.length - 1;
  }

  saveInsumosSelection(selectedItems: any[]) {
    // Guardar la selección de insumos en el servicio
    this.selectedDataService.saveSelectedData(selectedItems);
  }

  saveDependenciasSelection(selectedItemsDependencias: any[]) {
    // Guardar la selección de insumos en el servicio
    this.selectedDataService.saveSelectedDataDependencias(selectedItemsDependencias);
  }

  showSelectedDate(event: any) {
    this.horasSeleccionadas = [];
    const horariosUtilizados = this.horariosUtilizados;
    //console.log("Horarios utilizados: ", horariosUtilizados);
    const fechaSeleccionada = new Date(event); // Convertir a objeto Date si no lo es
    fechaSeleccionada.setHours(fechaSeleccionada.getHours() - 2);
    const fechaFormateada = this.formatDate(fechaSeleccionada); // Formatear la fecha
    //console.log('Fecha seleccionada:', fechaFormateada);

    //Verificamos que la fecha seleccionada posea reservas ya ingresadas.
    const elementosEncontrados = horariosUtilizados.filter(elemento => {
      const fechaElemento = new Date(elemento.FechaReserva); // Convertir la fecha del elemento a objeto Date
      fechaElemento.setUTCHours(0, 0, 0, 0); // Establecer la hora a medianoche en UTC
      const fechaElementoFormateada = this.formatDate(fechaElemento); // Formatear la fecha del elemento
      return fechaElementoFormateada === fechaFormateada;
    });
    //console.log("Elementos encontrados: ", elementosEncontrados);
    //Obtenemos el codigo de la dependencia para buscar si tiene reservas en horarios utilizados
    const dependencias = this.selectedItemsDependencias;
    let codeDependencia: number;
    for (const key in dependencias) {
      if (Object.prototype.hasOwnProperty.call(dependencias, key)) {
        if(key == 'code'){
          codeDependencia = dependencias[key];
        }
      }
    }
    //Si existen elementos encontrados para la fecha seleccionada seguimos adelante
    if (elementosEncontrados.length > 0) {
      //console.log("Elementos encontrados 2: ", elementosEncontrados);
      const dependeciasEncontradas = elementosEncontrados.filter(elemento => {
        return elemento.DependenciaId === codeDependencia;
      });
      
      //console.log("Dependencias encontradas; ",dependeciasEncontradas);
      if (dependeciasEncontradas.length > 0) {
        const horaOcupadasIds: any[] = [];
        dependeciasEncontradas.forEach(dependencia => {
          //console.log(dependencia);
          horaOcupadasIds.push(dependencia.HoraSeleccionadaId);
        });
        //console.log("horas ocupadas id: ", horaOcupadasIds);
        //Se agregan validación para que muestre las fechas en otro color cuando están ocupadas las dependencias
        this.gruposDeHoras.forEach(grupo => {
              grupo.forEach(item => {
                  if (horaOcupadasIds.includes(item.Id)) {
                      item.seleccionado = true;
                  }else{
                    delete item.seleccionado;
                  }
              });
        });
    }else{
        console.log('No se encontraron dependencias');
        // Eliminar la propiedad 'seleccionado' de todos los elementos
        this.limpiarGrupoFechas();
        this.horasSeleccionadas = [];
      }
    } else {
        console.log('No se encontraron objetos con la fecha buscada.');
        this.limpiarGrupoFechas();
        this.horasSeleccionadas = [];
    }
    this.selectedDate = event;
  }
  
  limpiarGrupoFechas(){
    this.gruposDeHoras.forEach(grupo => {
      grupo.forEach(item => {
          delete item.seleccionado;
      });
    });
  }

  formatDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  toggleHoraSeleccionada(hora: Horario) {
    hora.seleccionado = !hora.seleccionado;
    if (hora.seleccionado) {
        this.horasSeleccionadas.push(hora);
    } else {
        this.horasSeleccionadas = this.horasSeleccionadas.filter(item => item !== hora);
    }
  }
  
  saveReserva() {
    this.mostrarContenido = false; // Oculta el contenido de la página
    this.guardandoReserva = true; // Muestra la barra de carga
    // Recolecta los datos de la reserva desde las variables del componente
    const datosReserva = {
      NombreReserva: this.nombreReserva,
      NPersonas: this.numeroPersonas,
      Comentario: this.comentarios,
      UserId: 13,
      DependenciaId: this.selectedItemsDependencias,
      Insumos: this.selectedItems,
      FechaReserva: this.selectedDate
    };
    // Envía los datos de la reserva al servidor
    this.reservaService.createNewReserva(datosReserva).subscribe(
      (reserva: any) => {
        //console.log('Reserva guardada con éxito:', reserva);
        const reservaId = reserva.id; // Obtén el ID de la reserva creada
        // Crea un array de objetos para guardar los insumos asociados a la reserva
        const reservaInsumos = this.selectedItems.map(insumo => {
          return {
            ReservaId: reservaId[""],
            InsumoId: insumo.code
          };
        });
        console.log("Horas seleccionadas: ",this.horasSeleccionadas);
        const reservaHorarios = this.horasSeleccionadas.map(horario => {
          return {
            ReservaId: reservaId[""],
            HoraSeleccionada: horario.Horario,
            FechaReserva: this.selectedDate.toString()
          }
        })
        // Guarda los insumos asociados a la reserva en la tabla Reserva_Has_Insumos
        this.reservaInsumoService.createNewReservaInsumos(reservaInsumos).subscribe(
          () => {
            //console.log('Insumos asociados a la reserva guardados con éxito');
            this.guardandoReserva = false; // Oculta la barra de carga después de guardar
            this.mostrarContenido = true; // Muestra el contenido de la página nuevamente
          },
          error => {
            //console.error('Error al guardar los insumos asociados a la reserva:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al momento de procesar los insumos. Contactese con el administrador.', life: 3000 });
          }
        );
        this.reservaHorariosService.createNewReservaHorarios(reservaHorarios).subscribe(
          () => {
            this.guardandoReserva = false; // Oculta la barra de carga después de guardar
            this.mostrarContenido = true; // Muestra el contenido de la página nuevamente
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al momento de procesar los horarios. Contactese con el administrador.', life: 3000 });
          }
        );
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      error => {
        //console.error('Error al guardar la reserva:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al momento de procesar la reserva. Contactese con el administrador.', life: 3000 });
        this.guardandoReserva = false; // Asegúrate de ocultar la barra de carga en caso de error
        this.mostrarContenido = true; // Muestra el contenido de la página nuevamente
      }
    );
  }
  limpiarHorasSeleccionadas(){
    //console.log("horas seleccionadas: ", this.horasSeleccionadas);
    const horaOcupadasIds: any[] = [];
        this.horasSeleccionadas.forEach(dependencia => {
          horaOcupadasIds.push(dependencia.Id);
        });
    //console.log("horas ids: ",horaOcupadasIds);
    this.gruposDeHoras.forEach(grupo => {
      grupo.forEach(item => {
          if (horaOcupadasIds.includes(item.Id)) {
            delete item.seleccionado;
          }
      });
    });
    this.horasSeleccionadas = [];
    //console.log("horas seleccionadas post: ", this.horasSeleccionadas);
  }
}