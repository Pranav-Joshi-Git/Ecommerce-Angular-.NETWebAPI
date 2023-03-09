import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { Cart, Order, Payment, PaymentMethod } from '../models/models';
import { NavigationService } from '../services/navigation.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit{
  selectedPaymentMethodName = 'a';
  selectedPaymentMethod = new FormControl('0');
  paymentMethods: PaymentMethod[] = [];
  address = '';
  mobileNumber = '';
  displaySpinner = false;
  paymentMessage = '';
  clasname = ''; //for changing color of spinner

  usersCart: Cart ={
    id: 0,
    user: this.utilityService.getUser(),
    cartItems: [],
    ordered: false,
    orderedOn: ''
  }

  usersPaymentInfo: Payment = {
    id: 0,
    user: this.utilityService.getUser(),
    paymentMethod: {
      id: 0,
      type: '',
      provider: '',
      available: false,
      reason: '',
    },
    totalAmount: 0,
    shippingCharges: 0,
    amountReduced: 0,
    amountPaid: 0,
    createdAt: '',
  };

  constructor(
    private navigationService : NavigationService,
    private utilityService : UtilityService,
    private router: Router
  ){}

  ngOnInit(): void {
    //Get Payment Methods
    this.navigationService.getPaymentMethods()
      .subscribe((res)=>{
        this.paymentMethods = res;
      });


    this.selectedPaymentMethod.valueChanges.subscribe((res:any)=>{
      if(res === '0') this.selectedPaymentMethodName = '';
      else this.selectedPaymentMethodName = res.toString();
    });    

    //Get Cart
    this.navigationService
      .getActiveCartOfUser(this.utilityService.getUser().id)
      .subscribe((res: any)=>{
        this.usersCart = res;
        this.utilityService.calculatePayment(res, this.usersPaymentInfo);
      });

      //Get address and mobile number
      this.address = this.utilityService.getUser().address;
      this.mobileNumber = this.utilityService.getUser().mobile;

  }

  showPaymentMethod(id: string){
    let x = this.paymentMethods.find((v)=> v.id === parseInt(id));
    return x?.type + '-' + x?.provider;
  }

  placeOrder(){
    this.displaySpinner = true;
    let isPaymentSuccessful = this.payMoney();
    if(!isPaymentSuccessful){
      this.displaySpinner = false;
      this.paymentMessage = "Payment failed.. Something went wrong!";
      this.clasname = 'text-danger';
      return;
    }

    //displaying payment processing messages
    let step = 0
    let count = timer(0, 3000).subscribe((res)=>{
      ++step;
      if(step===1) {
        this.paymentMessage = 'Processing Payment..';
        this.clasname = 'text-success'
      }

      if(step===2) {
        this.paymentMessage = 'Payment Successful. Order is being placed..';
        this.storeOrder(); //method to send current cart to backend
      }
        
      if(step===3) {
        this.paymentMessage = 'Your order has been placed';
        this.displaySpinner = false;
      }

      if(step===4) {
        this.router.navigateByUrl('/home');
        count.unsubscribe();
      }

    });
  }
  payMoney(){
    return true;
  }

  storeOrder(){
    let payment: Payment;
    let pmid = 0;   //payment id
    if(this.selectedPaymentMethod.value)
      pmid = parseInt(this.selectedPaymentMethod.value);

      payment = {
        id: 0,
        paymentMethod: {
          id: pmid,
          type: '',
          provider: '',
          available: false,
          reason: '',
        },
        user: this.utilityService.getUser(),
        totalAmount: this.usersPaymentInfo.totalAmount,
        shippingCharges: this.usersPaymentInfo.shippingCharges,
        amountReduced: this.usersPaymentInfo.amountReduced,
        amountPaid: this.usersPaymentInfo.amountPaid,
        createdAt: '',
      };
      this.navigationService
      .insertPayment(payment)
      .subscribe((paymentResponse: any) => {
        payment.id = parseInt(paymentResponse);
        let order: Order = {
          id: 0,
          user: this.utilityService.getUser(),
          cart: this.usersCart,
          payment: payment,
          createdAt: '',
        };
        this.navigationService.insertOrder(order).subscribe((orderResponse) => {
          this.utilityService.changeCart.next(0);
        });
      });
  }

}
