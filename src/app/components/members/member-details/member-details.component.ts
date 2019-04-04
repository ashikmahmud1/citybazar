import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ElectronService} from "ngx-electron";
import {Member} from "../../../models/member";
import {Transaction} from "../../../models/transaction";

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {

  memberID:number;
  member:Member;
  memberTransaction: Transaction = {};
  constructor(private route:ActivatedRoute,
              private _electronService:ElectronService,
              private _ngZone:NgZone,
              private router:Router) {
    this._electronService.ipcRenderer.once('set-member-by-id', (event,member) => {
      this._ngZone.run(() => {
        this.member = member;
      });
    });
    this._electronService.ipcRenderer.once('update-success', (event) => {
      this._ngZone.run(() => {
        //emit an event update transaction
        this.router.navigateByUrl('transactions');
      });
    });
    this._electronService.ipcRenderer.once('save-success', (event) => {
      this._ngZone.run(() => {
        this.updateMemberPoint();
      });
    });
  }

  ngOnInit() {
    this.memberID = +this.route.snapshot.paramMap.get('id');
    //emit an event get-order-by-id
    this._electronService.ipcRenderer.send('get-member-by-id',this.memberID);
  }
  withDraw() {

    //add the transaction to the database
    this.memberTransaction.Id = this.member.Id;
    this.memberTransaction.Name = this.member.Name;
    this.memberTransaction.MobileNo = this.member.MobileNo;
    this.memberTransaction.Date = new Date();
    this.memberTransaction.BuyPoint = 0;
    this.memberTransaction.ReferencePoint = 0;
    this.memberTransaction.Description = this.member.ReferencePoint + ' point withdraw';
    this.member.Point = this.member.Point - this.member.ReferencePoint;
    this.member.ReferencePoint = 0;
    this._electronService.ipcRenderer.send('insert-transactions', this.memberTransaction);
  }
  updateMemberPoint() {
    let updateMemberPoint = [];
    updateMemberPoint.push(this.member);
    this._electronService.ipcRenderer.send('update-member-point',updateMemberPoint);
  }
  withDrawBonus() {
    this.memberTransaction.Id = this.member.Id;
    this.memberTransaction.Name = this.member.Name;
    this.memberTransaction.MobileNo = this.member.MobileNo;
    this.memberTransaction.Date = new Date();
    this.memberTransaction.BuyPoint = 0;
    this.memberTransaction.ReferencePoint = 0;
    this.memberTransaction.Description = '10000 point withdraw';

    this.member.ReferencePoint = 0;
    this.member.BuyPoint = 0;
    this.member.Point = 0;
    this.member.TotalPoint = this.member.TotalPoint - 10000;
    this._electronService.ipcRenderer.send('insert-transactions', this.memberTransaction);
  }

}
