import { SaveVehicle } from './../models/vehicle';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class VehicleService {
  private readonly vehicleEndPoint = "/api/vehicles";
  constructor(private http: Http) { }

  getMakes(){
    return this.http.get("/api/makes")
      .map(res => res.json());
  }

  getFeatures(){
    return this.http.get("/api/features")
      .map(res => res.json());
  }

  create(vehicle: any) {
    return this.http.post(this.vehicleEndPoint, vehicle)
      .map(res => res.json());
  }

  getVehicle(id: number){
    return this.http.get(this.vehicleEndPoint + "/" + id)
      .map(res => res.json());
  }

  update(vehicle: SaveVehicle) {
    return this.http.put(this.vehicleEndPoint+ "/" + vehicle.id, vehicle)
      .map(res => res.json());
  }

  delete(id: number) {
    return this.http.delete(this.vehicleEndPoint+ "/" + id)
      .map(res => res.json());
  }

  getVehicles(filter: any) {
    return this.http.get(this.vehicleEndPoint + "?" + this.toQueryString(filter))
      .map(res => res.json());
  }

  toQueryString(obj: any) {
    var part = [];
    for(let property in obj) {
      var value = obj[property]
      if(value != null && value != undefined) {
        part.push(encodeURIComponent(property) + "=" + encodeURIComponent(value));
      }
    }
    return part.join('&');
  }
}
