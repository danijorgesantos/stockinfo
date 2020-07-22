import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import * as moment from 'moment';


import { DataService } from '../_services/data';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  public currentDate = moment().format('MMMM Do YYYY, h:mm:ss a');
  public loading = true;
  public error = '';
  columnDefs = [
    { headerName: 'Date', field: 'date', resizable: true },
    { headerName: 'Open', field: 'open' , resizable: true },
    { headerName: 'High', field: 'high' , resizable: true },
    { headerName: 'Low', field: 'low' , resizable: true },
    { headerName: 'Close', field: 'close' , resizable: true  },
    { headerName: 'Volume', field: 'volume' , resizable: true }
  ];

  rowData = [
    { close:  "--" ,
    date:  "--" ,
    high:  "--" ,
    low:  "--" ,
    open:  "--" ,
    volume: "--" },
  ];

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.dataService.getData()
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            this.rowData = data;
            console.log(this.rowData)
            this.loading = false;
          }
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }


}
