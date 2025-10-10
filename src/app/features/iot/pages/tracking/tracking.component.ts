import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Telemetry } from '../../models/telemetry.model';
import { TelemetryService } from '../../services/telemetry.service';

/**
 * @Component
 * @description Component for tracking a vehicle's telemetry data in real-time.
 */
@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {
  telemetry: Telemetry | undefined;

  constructor(
    private route: ActivatedRoute,
    private telemetryService: TelemetryService
  ) {}

  /**
   * @method ngOnInit
   * @description Initializes the component by fetching the telemetry data for the vehicle specified in the route.
   */
  ngOnInit(): void {
    const vehicleId = Number(this.route.snapshot.paramMap.get('id'));
    if (vehicleId) {
      this.telemetryService.getTelemetryByVehicleId(vehicleId).subscribe(data => {
        this.telemetry = data;
      });
    }
  }
}
