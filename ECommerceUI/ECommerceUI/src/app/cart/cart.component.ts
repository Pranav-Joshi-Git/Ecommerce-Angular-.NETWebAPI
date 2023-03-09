import { Component, OnInit } from '@angular/core';
import { Cart, Payment } from '../models/models';
import { NavigationService } from '../services/navigation.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  usersCart: Cart = {
    id: 0,
    user: this.utilityService.getUser(),
    cartItems: [],
    ordered: false,
    orderedOn: '',
  };

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

  usersPreviousCarts: Cart[] = [];

  constructor(
    public utilityService: UtilityService,
    private navigationService: NavigationService
  ) {}
  ngOnInit(): void {
    //get cart
    this.navigationService
      .getActiveCartOfUser(this.utilityService.getUser().id)
      .subscribe((res: any) => {
        //console.log(res)
        this.usersCart = res;
        
        // Calculate Payment
        this.utilityService.calculatePayment(
          this.usersCart,
          this.usersPaymentInfo
        );
      });

      //Getting all previous carts
      this.navigationService
        .getAllPerviousCarts(this.utilityService.getUser().id)
        .subscribe((res:any)=>{
          this.usersPreviousCarts = res;
        });
  }
}
