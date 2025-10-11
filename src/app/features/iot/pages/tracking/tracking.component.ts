import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Telemetry } from '../../models/telemetry.model';
import { TelemetryService } from '../../services/telemetry.service';
import { TranslateModule } from '@ngx-translate/core';
import { Vehicle } from '../../../listings/models/vehicle.model';
import { User } from '../../../iam/models/user.model';
import { VehicleService } from '../../../listings/services/vehicle.service';
import { ReviewService } from '../../../reviews/services/review.service';
import { switchMap, forkJoin, map } from 'rxjs';

/**
 * @Component
 * @description Component for tracking a vehicle's telemetry data in real-time.
 */
@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {
  telemetry: Telemetry | undefined;
  vehicle: Vehicle | undefined;
  owner: User | undefined;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private telemetryService: TelemetryService,
    private vehicleService: VehicleService,
    private reviewService: ReviewService
  ) {}

  /**
   * @method ngOnInit
   * @description Initializes the component by fetching the telemetry data, vehicle details,
   * and owner information for the vehicle specified in the route.
   */
  ngOnInit(): void {
    const vehicleId = Number(this.route.snapshot.paramMap.get('id'));
    if (vehicleId) {
      this.telemetryService.getTelemetryByVehicleId(vehicleId).pipe(
        switchMap(telemetry => {
          this.telemetry = telemetry;
          return forkJoin({
            vehicle: this.vehicleService.getVehicle(vehicleId),
            users: this.reviewService.getUsers()
          });
        }),
        map(({ vehicle, users }) => {
          this.vehicle = vehicle;
          this.owner = users.find(u => u.id === vehicle.ownerId);
          this.isLoading = false;
        })
      ).subscribe();
    } else {
      this.isLoading = false;
    }
  }
}
