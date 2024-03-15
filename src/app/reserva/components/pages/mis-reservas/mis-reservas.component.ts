import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { Product } from '../../../api/product';
@Component({
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.scss'
})
export class MisReservasComponent implements OnInit{
  products!: Product[];

  constructor(private productService: ProductService){
  }
  ngOnInit() {
    this.productService.getProductsSmall().then(data => this.products = data);
  }
}
