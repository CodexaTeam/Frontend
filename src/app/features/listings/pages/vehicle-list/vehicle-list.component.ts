import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Vehicle } from '../../models/vehicle.model';
import { AuthService } from '../../../iam/services/auth.service';
import { forkJoin, map } from 'rxjs';
import { ReviewService } from '../../../reviews/services/review.service';
import { TranslateModule } from '@ngx-translate/core';
import {VehicleService} from '../../services/vehicle.service';

/**
 * @Component
 * @description This component displays a list of all available vehicles.
 * It fetches vehicle and user data to show vehicle details along with the owner's name.
 */
@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  isLoading = true;

  constructor(
    private vehicleService: VehicleService,
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  /**
   * @method ngOnInit
   * @description On initialization, it fetches all vehicles and users, then maps the owner's name to each vehicle.
   */
  ngOnInit(): void {
    forkJoin({
      vehicles: this.vehicleService.getVehicles(),
      users: this.reviewService.getUsers()
    }).pipe(
      map(({ vehicles, users }) => {
        const userMap = new Map<number, string>(users.map(u => [u.id, u.name]));

        vehicles.forEach(vehicle => {
          vehicle.ownerName = userMap.get(vehicle.ownerId) || 'Propietario Desconocido';
        });

        return vehicles;
      })
    ).subscribe(vehiclesWithOwners => {
      this.vehicles = vehiclesWithOwners;
      this.isLoading = false;
    });
  }
}
