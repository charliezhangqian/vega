import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { VehicleService } from './../../services/vehicle.service';
import { KeyValuePair, SaveVehicle, Vehicle } from '../../models/vehicle';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private toastyService: ToastyService
  ) {
    activatedRoute.params.subscribe(
      params => {
        this.vehicle.id = +params['id'] || 0;
      }
    );
  }

  makes: any[] = [];
  vehicle: SaveVehicle = {
    id: 0,
    makeId: 0,
    modelId: 0,
    isRegistered: false,
    features: [],
    contact: {
      name: '',
      phone: '',
      email: ''
    }
  };
  models: any[] = [];
  features: any[] = [];

  ngOnInit() {
    var sources = [
      this.vehicleService.getMakes(),
      this.vehicleService.getFeatures()
    ]
    if (this.vehicle.id)
      sources.push(this.vehicleService.getVehicle(this.vehicle.id));

    Observable.forkJoin(sources).subscribe(
      data => {
        this.makes = data[0];
        this.features = data[1];
        if (this.vehicle.id) {
          this.setVehicle(data[2])
          this.populateModels();
        }
      },
      error => {
        if (error.status == 404)
          this.router.navigate(['/home']);
      }
    );
  }

  setVehicle(v: Vehicle) {
    this.vehicle.id = v.id;
    this.vehicle.makeId = v.make.id;
    this.vehicle.modelId = v.model.id;
    this.vehicle.isRegistered = v.isRegistered;
    this.vehicle.features = v.features.map(f => f.id);
    this.vehicle.contact = v.contact;
  }

  onMakeChange() {
    this.populateModels();
    delete this.vehicle.modelId;
  }

  private populateModels() {
    var selectedMake = this.makes.find(m => m.id == this.vehicle.makeId);
    this.models = selectedMake ? selectedMake.models : [];
  }

  onFeatureToggle(featureId: number, $event: any) {
    if ($event.target.checked)
      this.vehicle.features.push(featureId);
    else {
      var index = this.vehicle.features.indexOf(featureId);
      this.vehicle.features.splice(index, 1);
    }
  }

  submit() {
    var result$ = (this.vehicle.id) ? this.vehicleService.update(this.vehicle) : this.vehicleService.create(this.vehicle);
    result$.subscribe(
      x => {
        this.toastyService.success({
          title: 'Success',
          msg: 'The vehicle was succesfully updated.',
          theme: 'bootstrap',
          showClose: true,
          timeout: 5000
        });
        this.router.navigate(['/vehicles']);
      });
  }
}
