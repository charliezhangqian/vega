import { KeyValuePair } from './../../models/vehicle';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { VehicleService } from './../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {

  constructor(
    private vehicleService: VehicleService
  ) { }
  private readonly PAGE_SIZE = 5;

  queryResult = {};
  makes: KeyValuePair[] = [];
  query: any = {
    pageSize: this.PAGE_SIZE
  };
  columns = [
    { title: "Id" },
    { title: "Make", key: "make", isSortable: true},
    { title: "Model", key: "model", isSortable: true},    
    { title: "Contact Name", key: "contactName", isSortable: true},
    {}
  ]

  ngOnInit() {
    this.vehicleService.getMakes().subscribe(
      m => this.makes = m
    );
    this.populateVehicles();
  }

  private populateVehicles() {
    this.vehicleService.getVehicles(this.query)
      .subscribe(
        result => {
          this.queryResult = result;
        }
      );
  }

  onFilterChange() {
    this.query.page = 1;
    this.populateVehicles();
  }

  resetFilter() {
    this.query = {
      pageSize: this.PAGE_SIZE,
      page: 1
    };
    this.populateVehicles();
  }

  sortBy(columnName: string) {
    if(this.query.sortBy === columnName)
      this.query.isSortAscending = !this.query.isSortAscending;
    else {
      this.query.sortBy = columnName;
      this.query.isSortAscending = true;
    }
    this.populateVehicles();
  }

  onPageChange(page: number) {
    this.query.page = page;
    this.populateVehicles();
  }
}
