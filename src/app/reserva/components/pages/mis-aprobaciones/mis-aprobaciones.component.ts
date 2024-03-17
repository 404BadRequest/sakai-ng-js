import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { Product } from '../../../api/product';

@Component({
  templateUrl: './mis-aprobaciones.component.html',
  styleUrl: './mis-aprobaciones.component.scss'
})
export class MisAprobacionesComponent implements OnInit{
  products!: Product[];

  constructor(private productService: ProductService){
  }
  ngOnInit() {
    this.productService.getProductsSmall().then(data => this.products = data);
  }
}
