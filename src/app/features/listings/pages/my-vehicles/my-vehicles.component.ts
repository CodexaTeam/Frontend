import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../services/vehicle.service';
import { AuthService } from '../../../iam/services/auth.service';
import { take } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

/**
 * @Component
 * @description This component displays a list of vehicles owned by the current user.
 */
@Component({
  selector: 'app-my-vehicles',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
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

  /**
   * @method deleteVehicle
   * @description Prompts for confirmation and deletes a vehicle if confirmed.
   * @param {number} id - The ID of the vehicle to be deleted.
   */
  deleteVehicle(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
      this.vehicleService.deleteVehicle(id).subscribe({
        next: () => {
          this.vehicles = this.vehicles.filter(v => v.id !== id);
          alert('Vehículo eliminado con éxito.');
        },
        error: (err) => {
          console.error('Error al eliminar el vehículo:', err);
          alert('Hubo un error al eliminar el vehículo.');
        }
      });
    }
  }
}
