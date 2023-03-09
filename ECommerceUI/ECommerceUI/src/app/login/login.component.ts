import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationService } from '../services/navigation.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  loginForm !: FormGroup;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private navigationService: NavigationService,
    private utilityService: UtilityService){}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      
      email : [
        '',
        [
        Validators.required, 
        Validators.email
        ]
      ],
      pwd:[
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15)
        ]
      ],
    
  })
  
  }

  login(){
    let email = this.Email.value;
    let password = this.PWD.value;
    this.navigationService.loginUser(email,password).subscribe((res:any)=>{
      console.log(res);
      if(res.toString() !== 'invalid') {
         this.message = 'Login Successful';
         this.utilityService.setUser(res.toString());
         console.log(this.utilityService.getUser())
      }
      else this.message = 'Invalid Credentials!'
    });
    
  }

  get Email() : FormControl{
    return this.loginForm.get('email') as FormControl;
  }
  get PWD() : FormControl{
    return this.loginForm.get('pwd') as FormControl;
  }
}