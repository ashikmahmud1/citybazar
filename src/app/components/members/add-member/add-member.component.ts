import {Component, NgZone, OnInit} from '@angular/core';
import {Member} from "../../../models/member";
import {Router} from "@angular/router";
import {ElectronService} from "ngx-electron";

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent implements OnInit {

  member:Member = {Id:null,Name:'',MobileNo:'',Address:'',ReferenceNumber:'',Point:0,ReferencePoint:0,BuyPoint:0,TotalPoint:0};
  constructor(private _electronService:ElectronService,
              private _ngZone:NgZone,
              private router:Router) {
    this._electronService.ipcRenderer.on('generated-member-id', (event,id) => {
      this._ngZone.run(() => {
        this.member.Id = id;
      });
    });
    this._electronService.ipcRenderer.on('save-success', () => {
      this._ngZone.run(() => {
        this.router.navigateByUrl('members');
      });
    });
  }

  ngOnInit() {
    //generate Id
    this._electronService.ipcRenderer.send('generate-member-id');
  }
  onSubmit(){
    this.member.Date = new Date();
    this._electronService.ipcRenderer.send('insert-member',this.member)
  }
}
