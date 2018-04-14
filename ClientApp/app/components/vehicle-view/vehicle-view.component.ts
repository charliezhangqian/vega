import { NgZone } from '@angular/core';
import { ProgressService } from './../../services/progress.service';
import { PhotoService } from './../../services/photo.service';
import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { VehicleService } from './../../services/vehicle.service';
@Component({
  selector: 'app-vehicle-view',
  templateUrl: './vehicle-view.component.html',
  styleUrls: ['./vehicle-view.component.css']
})
export class VehicleViewComponent implements OnInit {

  vehicle: any;
  vehicleId: number = 0;
  @ViewChild('fileInput') fileInput: any;
  photos: any[] = [];
  progress: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private toasty: ToastyService,
    private photoService: PhotoService,
    private progressService: ProgressService,
    private zone: NgZone
  ) {
    this.activatedRoute.params.subscribe(
      params => {
        this.vehicleId = +params['id'];
        if (isNaN(this.vehicleId) || this.vehicleId <= 0) {
          this.router.navigate(['/vehicles']);
        }
      }
    )
  }

  ngOnInit() {
    this.vehicleService.getVehicle(this.vehicleId)
      .subscribe(
        v => this.vehicle = v,
        error => {
          if (error.status = 404) {
            this.router.navigate(['/vehicles']);
          }
        }
      );

    this.photoService.getPhotos(this.vehicleId)
      .subscribe(photos => this.photos = photos);
  }

  delete() {
    if (confirm("Are you sure?")) {
      this.vehicleService.delete(this.vehicleId)
        .subscribe(
          x => this.router.navigate(['/vehicles'])
        );
    }
  }

  uploadPhoto() {
    this.progressService.startTracking()
      .subscribe((p: any) => {
        console.log(p);
        this.zone.run(() => {
            this.progress = p;
        });
      },
      undefined,
      () => this.progress = null 
    );

    var nativeElement: HTMLInputElement = this.fileInput.nativeElement;
    var file = nativeElement.files![0];
    nativeElement.value = "";
    this.photoService.uploadPhoto(this.vehicleId, file)
      .subscribe(
        photo => this.photos.push(photo)
      );
  }
}
