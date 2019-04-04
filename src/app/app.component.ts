import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Subscription} from "rxjs";

declare var jquery:any;
declare var $ :any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy{
  isAuth = false;
  authSubscription:Subscription;
  constructor(private authService:AuthService){

  }
  ngOnInit(){
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus
    });
    $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
      });
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
