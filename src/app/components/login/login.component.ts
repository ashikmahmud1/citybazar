import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {Subscription} from "rxjs/index";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {
  isAuth = false;
  authSubscription:Subscription;
  user:User = {email:'',password:''};
  constructor(private authService:AuthService,private router:Router) { }

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
      if (this.isAuth){
        //redirect the user to the members route
        this.router.navigateByUrl('members');
      }
    })
  }
  onSubmit() {
    this.authService.login(this.user);
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
