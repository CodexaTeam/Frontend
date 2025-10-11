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
import { BookingService } from '../../../booking/services/booking.service'; // Importado
import { switchMap, forkJoin, map } from 'rxjs';

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
  renter: User | undefined; // Renombrado de 'owner' a 'renter'
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private telemetryService: TelemetryService,
    private vehicleService: VehicleService,
    private reviewService: ReviewService,
    private bookingService: BookingService // Inyectado
  ) {}

  ngOnInit(): void {
    const vehicleId = Number(this.route.snapshot.paramMap.get('id'));
    if (vehicleId) {
      this.telemetryService.getTelemetryByVehicleId(vehicleId).pipe(
        switchMap(telemetry => {
          this.telemetry = telemetry;
          const activeBooking$ = this.bookingService.getBookingsForOwner(telemetry.vehicleId).pipe(
            map(bookings => bookings.find(b => b.estado === 'activa' && b.vehicleId === vehicleId))
          );

          return forkJoin({
            vehicle: this.vehicleService.getVehicle(vehicleId),
            users: this.reviewService.getUsers(),
            activeBooking: activeBooking$
          });
        }),
        map(({ vehicle, users, activeBooking }) => {
          this.vehicle = vehicle;
          if (activeBooking) {
            this.renter = users.find(u => u.id === activeBooking.userId);
          }
          this.isLoading = false;
        })
      ).subscribe();
    } else {
      this.isLoading = false;
    }
  }
}
