import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Vehicle } from '../../models/vehicle.model';
import { ReviewListComponent } from '../../../reviews/components/review-list/review-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReviewService } from '../../../reviews/services/review.service';
import { map, switchMap } from 'rxjs';
import {VehicleService} from '../../services/vehicle.service';

/**
 * @Component
 * @description This component displays the detailed information for a single vehicle,
 * including its owner's name and a list of reviews.
 */
@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReviewListComponent, TranslateModule],
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.css']
})
export class VehicleDetailComponent implements OnInit {
  vehicle: Vehicle | undefined;

  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private reviewService: ReviewService
  ) {}

  /**
   * @method ngOnInit
   * @description On initialization, it fetches the vehicle's details based on the route parameter
   * and then fetches user data to display the owner's name.
   */
  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.vehicleService.getVehicle(id).pipe(
          switchMap(vehicle => {
            return this.reviewService.getUsers().pipe(
              map(users => {
                const owner = users.find(u => u.id === vehicle.ownerId);
                vehicle.ownerName = owner ? owner.name : 'Propietario Desconocido';
                return vehicle;
              })
            );
          })
        );
      })
    ).subscribe(vehicle => {
      this.vehicle = vehicle;
    });
  }
}
