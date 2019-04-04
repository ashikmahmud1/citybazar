import {Component, NgZone, OnInit} from '@angular/core';
import {ElectronService} from "ngx-electron";
import {Member} from "../../../models/member";
import {Transaction} from "../../../models/transaction";
import {Router} from "@angular/router";
import {WarningComponent} from "../../warning/warning.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-add-point',
  templateUrl: './add-point.component.html',
  styleUrls: ['./add-point.component.css']
})
export class AddPointComponent implements OnInit {
  mobileNO:string;
  members: Member[];
  member: Member = {};
  referenceMember: Member = {};
  point;
  memberTransaction: Transaction = {};
  referenceMemberTransaction: Transaction = {};
  transactions: Transaction[] = [];

  constructor(private _electronService: ElectronService,
              private _ngZone: NgZone,
              private router: Router,
              private dialog:MatDialog) {
    this._electronService.ipcRenderer.setMaxListeners(this._electronService.ipcRenderer.getMaxListeners()+1);
    this._electronService.ipcRenderer.once('set-members', (event, members) => {
      this._ngZone.run(() => {
        this.members = members;
      });
    });
    this._electronService.ipcRenderer.once('save-success', (event) => {
      this._ngZone.run(() => {
        this.updateMemberPoint();
      });
    });
    this._electronService.ipcRenderer.once('update-success', (event) => {
      this._ngZone.run(() => {
        this.router.navigateByUrl('transactions');
      });
    });
  }

  ngOnInit() {
    this._electronService.ipcRenderer.send('get-members');
  }

  onSubmit() {
    const dialogRef = this.dialog.open(WarningComponent,{
      data:{
        message:'you are adding '+ this.point+' point to '+this.mobileNO
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.addTransaction();
      }
    });

  }
  updateMemberPoint() {
    let updateMembersPoint = [];
    //update the member point
    this.member.BuyPoint = this.member.BuyPoint + parseInt(this.point);
    this.member.Point = this.member.Point + parseInt(this.point);
    this.member.TotalPoint = this.member.TotalPoint + parseInt(this.point);

    //update the reference member point
    this.referenceMember.ReferencePoint = this.referenceMember.ReferencePoint + parseInt(this.point);
    this.referenceMember.Point = this.referenceMember.Point + parseInt(this.point);
    this.referenceMember.TotalPoint = this.referenceMember.TotalPoint + parseInt(this.point);
    updateMembersPoint.push(this.member,this.referenceMember);
    this._electronService.ipcRenderer.send('update-member-point',updateMembersPoint);

  }
  addTransaction() {
    // this.member = this.members.find(m => m.MobileNo === this.mobileNO);
    this.member = this.findMember(this.mobileNO);
    if (this.member){
      this.referenceMember = this.findMember(this.member.ReferenceNumber);
      if (this.referenceMember){
        this.memberTransaction.Id = this.member.Id;
        this.memberTransaction.Name = this.member.Name;
        this.memberTransaction.MobileNo = this.member.MobileNo;
        this.memberTransaction.BuyPoint = this.point;
        this.memberTransaction.ReferencePoint = 0;
        this.memberTransaction.Date = new Date();
        this.memberTransaction.Description = this.point + ' point added';


        this.referenceMemberTransaction.Id = this.referenceMember.Id;
        this.referenceMemberTransaction.Name = this.referenceMember.Name;
        this.referenceMemberTransaction.MobileNo = this.referenceMember.MobileNo;
        this.referenceMemberTransaction.ReferencePoint = this.point;
        this.referenceMemberTransaction.BuyPoint = 0;
        this.referenceMemberTransaction.Date = new Date();
        this.referenceMemberTransaction.Description = "got " + this.point + " points from " + this.member.MobileNo;

        this.transactions.push(this.memberTransaction);
        this.transactions.push(this.referenceMemberTransaction);

        this._electronService.ipcRenderer.send('insert-transactions', this.transactions);
      }
    }

  }
  findMember(mobileNo) {
    for (let i=0;i<this.members.length;i++) {
      console.log('passed mobile no '+mobileNo+' member mobile no '+this.members[i].MobileNo);
      if (this.members[i].MobileNo == mobileNo){
        return this.members[i];
      }
    }
    return null;
  }

}
