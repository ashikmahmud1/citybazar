import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Member} from "../../../models/member";
import {ElectronService} from "ngx-electron";

@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.css']
})
export class EditMemberComponent implements OnInit {
  memberID:number;
  member:Member;
  constructor(private route:ActivatedRoute,
              private router:Router,
              private _electronService:ElectronService,
              private _ngZone:NgZone) {
    this._electronService.ipcRenderer.once('set-member-by-id', (event,member) => {
      this._ngZone.run(() => {
        this.member = member;
      });
    });

    this._electronService.ipcRenderer.once('update-success', () => {
      this._ngZone.run(() => {
        this.router.navigateByUrl('members');
      });
    });
  }

  ngOnInit() {
    this.memberID = +this.route.snapshot.paramMap.get('id');
    //emit an event get-order-by-id
    this._electronService.ipcRenderer.send('get-member-by-id',this.memberID);
  }
  onSubmit() {
    this._electronService.ipcRenderer.send('update-member',this.member)
  }

}
