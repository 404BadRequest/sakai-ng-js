import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { DependenciaService } from 'src/app/reserva/service/dependencia.service';
import { InsumosService } from 'src/app/reserva/service/insumos.service';
import { ParametroDetalleService } from 'src/app/reserva/service/parametroDetalle.service';
import { SelectedDataService } from 'src/app/reserva/service/selected-data.service';

interface Hora {
  hora: number;
  minuto: number;
  seleccionado: boolean;
}

@Component({
  templateUrl: './new-reserva.component.html',
  providers: [MessageService]
})
export class NewResevaComponent implements OnInit { 

  horasDelDia: Hora[] = [];
  gruposDeHoras: any[] = []; 
  horasSeleccionadas: Hora[] = [];

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

  constructor(
    private parametroDetalle: ParametroDetalleService,
    private insumos: InsumosService,
    private selectedDataService: SelectedDataService,
    private messageService: MessageService,
    private dependencia: DependenciaService
  ) { }

  ngOnInit() {

    this.items = [
      { label: 'Información', command: () => this.activateStep(0), active: true },
      { label: 'Insumos / Dependencia', command: () => this.activateStep(1) },
      { label: 'Horario', command: () => this.activateStep(2) },
      { label: 'Confirmación', command: () => this.activateStep(3) }
    ];

    this.getInsumos();
    this.getDependencias();
    this.dropdownItemsInsumos = this.selectedDataService.getSelectedData();
    this.minDate = new Date();

    this.cols = [
      { field: 'hora', header: 'Hora' },
      { field: 'seleccionado', header: 'Seleccionar' }
    ];

    // Inicializar la lista de horas del día
    for (let i = 7; i < 24; i++) { // Comenzar desde las 7:30 am
      this.horasDelDia.push({ hora: i, minuto: 30, seleccionado: false });
      if (i < 23) {
          this.horasDelDia.push({ hora: i + 1, minuto: 0, seleccionado: false });
      }
    }
    // Agregar la última hora (12:00 am)
    this.horasDelDia.push({ hora: 0, minuto: 0, seleccionado: false });

    // Agrupar las horas en conjuntos de 3 para la presentación en la interfaz de usuario
    this.gruposDeHoras = this.chunkArray(this.horasDelDia, 3);

  }

  chunkArray(array: any[], size: number): any[] {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
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
    this.selectedDate = event;
  }

  toggleHoraSeleccionada(hora: Hora) {
    hora.seleccionado = !hora.seleccionado;
    if (hora.seleccionado) {
        this.horasSeleccionadas.push(hora);
    } else {
        this.horasSeleccionadas = this.horasSeleccionadas.filter(item => item !== hora);
    }
  }

  save(){
    
  }
}