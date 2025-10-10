import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../services/vehicle.service';
import { AuthService } from '../../../iam/services/auth.service';
import { take } from 'rxjs';

/**
 * @Component
 * @description This component displays a list of vehicles owned by the current user.
 */
@Component({
  selector: 'app-my-vehicles',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-vehicles.component.html',
  styleUrls: ['./my-vehicles.component.css']
})
export class MyVehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  currentOwnerId: number | null = null;

  constructor(
    private vehicleService: VehicleService,
    private authService: AuthService
  ) {}

  /**
   * @method ngOnInit
   * @description On initialization, it fetches the current user's ID and then retrieves the list of vehicles they own.
   */
  ngOnInit(): void {
    this.authService.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.currentOwnerId = user.id;
        this.vehicleService.getVehiclesByOwnerId(this.currentOwnerId).subscribe(vehicles => {
          this.vehicles = vehicles;
        });
      }
    });
  }
}
