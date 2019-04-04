import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MaterialModule} from "./material.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import { MembersComponent } from './components/members/members.component';
import { AddMemberComponent } from './components/members/add-member/add-member.component';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MemberService} from "./services/member.service";
import { AddPointComponent } from './components/members/add-point/add-point.component';
import {TransactionService} from "./services/transaction.service";
import { TransactionsComponent } from './components/members/transactions/transactions.component';
import { EditMemberComponent } from './components/members/edit-member/edit-member.component';
import {NgxElectronModule} from "ngx-electron";
import { MemberDetailsComponent } from './components/members/member-details/member-details.component';
import {AuthService} from "./services/auth.service";
import { LoginComponent } from './components/login/login.component';
import {WarningComponent} from "./components/warning/warning.component";

const appRoutes:Routes = [
  {path:'',component:LoginComponent},
  {path:'members',component:MembersComponent},
  {path:'add-member',component:AddMemberComponent},
  {path:'add-point',component:AddPointComponent},
  {path:'transactions',component:TransactionsComponent},
  {path:'edit-member/:id',component:EditMemberComponent},
  {path:'member-details/:id',component:MemberDetailsComponent},

];

@NgModule({
  declarations: [
    AppComponent,
    MembersComponent,
    AddMemberComponent,
    AddPointComponent,
    TransactionsComponent,
    EditMemberComponent,
    MemberDetailsComponent,
    LoginComponent,
    WarningComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    NgxElectronModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [MemberService,TransactionService,AuthService],
  bootstrap: [AppComponent],
  entryComponents:[WarningComponent]
})
export class AppModule { }
