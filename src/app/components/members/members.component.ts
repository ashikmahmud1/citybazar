import {AfterViewInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {MemberService} from "../../services/member.service";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Member} from "../../models/member";
import {Router} from "@angular/router";
import {ElectronService} from "ngx-electron";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit,AfterViewInit {
  displayedColumns = ['id', 'name', 'mobile-no', 'address','point', 'reference-number', 'action'];
  members:Member[];
  dataSource = new MatTableDataSource<Member>();
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  constructor(private memberService: MemberService,
              private _electronService:ElectronService,
              private _ngZone:NgZone,
              private router:Router) {
    this._electronService.ipcRenderer.setMaxListeners(this._electronService.ipcRenderer.getMaxListeners()+1);
    this._electronService.ipcRenderer.on('set-members', (event,members) => {
      this._ngZone.run(() => {
        this.members = members;
        this.dataSource.data = this.members;
      });
    });
    this._electronService.ipcRenderer.on('remove-success', () => {
      this._ngZone.run(() => {
        this._electronService.ipcRenderer.send('get-orders');
      });
    });
  }

  ngOnInit() {
    this._electronService.ipcRenderer.send('get-members');
  }

  Navigate() {
    this.router.navigateByUrl('add-member');
  }

  doFilter(filterValue:string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onEditMember(memberID:number) {
    this.router.navigate(['/edit-member',memberID]);
  }
  onDetailsMember(memberID:number) {
    this.router.navigate(['/member-details',memberID])
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
