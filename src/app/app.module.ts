import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
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

@NgModule({
    declarations: [
        AppComponent, NotfoundComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService, UserService, RolService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
