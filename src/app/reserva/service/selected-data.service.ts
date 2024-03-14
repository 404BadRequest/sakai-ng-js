import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectedDataService {
  selectedInsumos: any[] = [];
  selectedDependencias: any[] = [];

  constructor() { }

  saveSelectedData(data: any[]) {
    this.selectedInsumos = data;
  }

  getSelectedData() {
    return this.selectedInsumos;
  }

  saveSelectedDataDependencias(data: any[]) {
    this.selectedDependencias = data;
  }

  getSelectedDataDependencias() {
    return this.selectedDependencias;
  }
}