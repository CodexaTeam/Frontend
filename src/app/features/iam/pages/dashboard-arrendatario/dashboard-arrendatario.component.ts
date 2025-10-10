import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { Vehicle } from '../../../listings/models/vehicle.model';
import { Booking } from '../../../booking/models/booking.model';
import { VehicleService } from '../../../listings/services/vehicle.service';
import { BookingService } from '../../../booking/services/booking.service';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

/**
 * @Component
 * @description Dashboard for the renter, displaying a preview of available vehicles and active bookings.
 */
@Component({
  selector: 'app-dashboard-arrendatario',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './dashboard-arrendatario.component.html',
  styleUrls: ['./dashboard-arrendatario.component.css']
})
export class DashboardArrendatarioComponent implements OnInit {
  isLoading = true;
  previewVehicles: Vehicle[] = [];
  activeBookings: { booking: Booking, vehicle: Vehicle }[] = [];

  constructor(
    private vehicleService: VehicleService,
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  /**
   * @method ngOnInit
   * @description Initializes the component by fetching available vehicles and active bookings for the current user.
   */
  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.isLoading = false;
      return;
    }

    forkJoin({
      vehicles: this.vehicleService.getVehicles(),
      bookings: this.bookingService.getBookingsByUserId(currentUser.id)
    }).pipe(
      map(({ vehicles, bookings }) => {
        const availableVehicles = vehicles.filter(v => v.status === 'available').slice(0, 3);

        const allActiveBookings = bookings
          .filter(b => b.status === 'activa')
          .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

        const activeBookingsWithDetails = allActiveBookings.map(booking => {
          const vehicleForBooking = vehicles.find(v => v.id === booking.vehicleId);
          return vehicleForBooking ? { booking, vehicle: vehicleForBooking } : null;
        }).filter(item => item !== null) as { booking: Booking, vehicle: Vehicle }[];

        return { previewVehicles: availableVehicles, activeBookings: activeBookingsWithDetails };
      })
    ).subscribe(({ previewVehicles, activeBookings }) => {
      this.previewVehicles = previewVehicles;
      this.activeBookings = activeBookings;
      this.isLoading = false;
    });
  }
}
