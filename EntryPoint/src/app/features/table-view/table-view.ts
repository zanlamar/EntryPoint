import { Component, OnInit } from '@angular/core';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';
import { TableModule } from 'primeng/table';
import { SelectButton } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-view',
  imports: [CommonModule, TableModule, SelectButton],
  templateUrl: './table-view.html',
  styleUrl: './table-view.css',
  standalone: true
})
export class TableView implements OnInit {
  products: Product[] = [];
  sizes: any[] = [];
  selectedSize: any = undefined;

constructor(private productService: ProductService) {}

ngOnInit() {
  this.productService.getProductsMini().then((data) => {
      this.products = data;
  });

  this.sizes = [
      { name: 'Small', value: 'small' },
      { name: 'Normal', value: undefined },
      { name: 'Large', value: 'large' }
  ];}
}