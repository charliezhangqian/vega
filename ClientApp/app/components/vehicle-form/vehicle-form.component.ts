import { Component, OnInit } from '@angular/core';

import { VehicleService } from './../../services/vehicle.service';
import { KeyValuePair } from '../../models/vehicle';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {

  constructor(private vehicleService: VehicleService) { }

  makes: any[] = [];
  vehicle: any = {};
  models = [];
  features: any[] = [];

  ngOnInit() {
    this.vehicleService.getMakes().subscribe(
      makes => this.makes = makes
    );
    this.vehicleService.getFeatures().subscribe(
      features => this.features = features
    );
  }

  onMakeChange() {
    var selectedMake = this.makes.find(m => m.id == this.vehicle.make);
    this.models = selectedMake.models;
  }
}
