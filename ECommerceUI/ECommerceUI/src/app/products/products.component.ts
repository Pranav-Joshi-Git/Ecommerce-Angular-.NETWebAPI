import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/models';
import { NavigationService } from '../services/navigation.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  view : 'grid' | 'list' = 'list';
  sortby : 'default' | 'htl' | 'lth' = 'default';
  products: Product[] =[];

  constructor(
    private activatedRoute : ActivatedRoute,
    private navigationService : NavigationService,
    private utilityService : UtilityService
  ){}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any)=>{
      let category = params.category;
      let subcategory = params.subCategory;

      if(category && subcategory)
        this.navigationService
          .getProducts(category, subcategory, 10)
          .subscribe((res:any)=>{
            console.log(res);
            this.products = res;
            console.log(res)
          });
    })
  }

  sortByPrice(sortkey:string){
    this.products.sort((a,b) => {
      if(sortkey === 'default'){
        return a.id > b.id ? 1:-1;
      }
      if(sortkey === 'htl'){
          
        return this.utilityService.applyDiscount(a.price, a.offer.discount) >
               this.utilityService.applyDiscount(b.price, b.offer.discount)
                ? -1
                : 1;

      }
      if(sortkey ==='lth'){
        
        return this.utilityService.applyDiscount(a.price, a.offer.discount) >
               this.utilityService.applyDiscount(b.price, b.offer.discount)
                ? 1
                : -1;        
      }
      return 0;
    });
  }

}
