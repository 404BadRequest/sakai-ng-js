import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUsuariosComponent } from './admin-usuarios.component';
import { AdminUsuariosRoutingModule } from './admin-usuarios-routing.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { RatingModule } from 'primeng/rating';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {ProgressBarModule} from 'primeng/progressbar';

@NgModule({
  imports: [
      CommonModule,
      TableModule,
      FileUploadModule,
      FormsModule,
      ButtonModule,
      RippleModule,
      ToastModule,
      ToolbarModule,
      RatingModule,
      InputTextModule,
      InputTextareaModule,
      DropdownModule,
      RadioButtonModule,
      InputNumberModule,
      DialogModule,
      AdminUsuariosRoutingModule,
      ProgressSpinnerModule,
      ProgressBarModule
    ],
    declarations: [AdminUsuariosComponent]
})
export class AdminUsuariosModule { }