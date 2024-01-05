import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUsuariosComponent } from './admin-usuarios.component';
import { AdminUsuariosRoutingModule } from './admin-usuarios-routing.module';

@NgModule({
  imports: [
      CommonModule,
      AdminUsuariosRoutingModule
    ],
    declarations: [AdminUsuariosComponent]
})
export class AdminUsuariosModule { }