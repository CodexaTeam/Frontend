import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../../../../../../../../../../../Desktop/codigo subir/Chirstian/app/features/listings/services/vehicle.service';
import { AuthService } from '../../../iam/services/auth.service';
import { forkJoin, map } from 'rxjs';
import { ReviewService } from '../../../reviews/services/review.service';
import { TranslateModule } from '@ngx-translate/core';

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
