import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../models/models';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{
  @Input() view : 'grid' | 'list' | 'currentcartitem' | 'previouscartitem' = 'grid';
  @Input() product: Product = {
    id: 0,
    title: '',
    description: '',
    productCategory: {
      id: 1,
      category: '',
      subCategory: ''
    },
    offer: {
      id: 1,
      title: '',
      discount: 0
    },
    price: 0,
    quantity: 0,
    imageName: ''
  }
  constructor(public utilityService:UtilityService){}

  ngOnInit(): void {
    
  }

}
