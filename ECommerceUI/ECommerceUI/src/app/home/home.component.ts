import { Component, OnInit } from '@angular/core';
import { SuggestedProduct } from '../models/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  suggestedProducts : SuggestedProduct[] =[
    {
      bannerimage : 'Baner/Baner_Mobile.png',
      category : {
        id : 0,
        category : 'electronics',
        subCategory : 'mobiles'
      },
    },
    {
      bannerimage : 'Baner/Baner_Laptop.png',
      category : {
        id : 1,
        category : 'electronics',
        subCategory : 'laptops'
      },
    },
    {
      bannerimage : 'Baner/Baner_Chair.png',
      category : {
        id : 1,
        category : 'furniture',
        subCategory : 'chairs'
      },
    }
  ];

  constructor(){}

  ngOnInit(): void {}

}
