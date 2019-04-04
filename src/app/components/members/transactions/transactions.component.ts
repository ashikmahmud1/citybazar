import {AfterViewInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Transaction} from "../../../models/transaction";
import {TransactionService} from "../../../services/transaction.service";
import {Router} from "@angular/router";
import {ElectronService} from "ngx-electron";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit,AfterViewInit {
  displayedColumns = ['id', 'name', 'mobile-no', 'date', 'description'];
  dataSource = new MatTableDataSource<Transaction>();
  transactions:Transaction[] = [];
  fromDate:Date;
  toDate:Date;
  totalBuyPoints;
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  constructor(private transactionService:TransactionService,
              private router:Router,
              private _electronService:ElectronService,
              private _ngZone:NgZone) {
    this._electronService.ipcRenderer.once('set-transactions', (event,transactions) => {
      this._ngZone.run(() => {
        //check if the member exist
        this.transactions = transactions;
        this.dataSource.data = this.transactions;
        this.calculateBuyPoints();
      });
    });
  }

  ngOnInit() {
    let dateOneMonthAgo = new Date();
    dateOneMonthAgo.setMonth(dateOneMonthAgo.getMonth() - 1);
    this.fromDate =  dateOneMonthAgo;
    this.toDate = new Date();
    this._electronService.ipcRenderer.send('get-transactions');

  }
  doFilter(filterValue:string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  Navigate() {
    this.router.navigateByUrl('add-point');
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  calculateBuyPoints() {
    this.totalBuyPoints = 0;
    // let sum:number;
    // sum = 0;
    //
    // for (let i=0;i<this.transactions.length;i++) {
    //   let transactionDateObject = new Date(this.transactions[i].Date);
    //   if (transactionDateObject >= this.fromDate && transactionDateObject <= this.toDate){
    //     sum = sum + this.transactions[i].BuyPoint;
    //   }
    // }
    // this.totalBuyPoints = sum;
    this.transactions.map(transaction => {
      let transactionDateObject = new Date(transaction.Date);
      //check if the transactionDate is in the range of fromDate to toDate
      //if in the range add the buyPoints to the totalBuyPoints
      console.log(transactionDateObject);
      if (transactionDateObject.getDate() >= this.fromDate.getDate() && transactionDateObject.getDate() <= this.toDate.getDate()){
        this.totalBuyPoints = (this.totalBuyPoints * 1) + (transaction.BuyPoint*1);
      }
    })
  }

}
