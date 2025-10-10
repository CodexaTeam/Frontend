import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../../iam/services/auth.service';
import { VehicleService } from '../../../listings/services/vehicle.service';
import { switchMap, of, forkJoin, map } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

/**
 * @Component
 * @description This component displays a list of all bookings made by the current user,
 * along with details of the booked vehicle.
 */
@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  bookingsWithDetails: any[] = [];
  isLoading = true;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private vehicleService: VehicleService
  ) {}

  /**
   * @method ngOnInit
   * @description On initialization, it fetches the current user's bookings and the details of each booked vehicle.
   */
  ngOnInit(): void {
    this.authService.currentUser$.pipe(
      switchMap(user => {
        if (user) {
          return this.bookingService.getBookingsByUserId(user.id);
        }
        return of([]);
      }),
      switchMap(bookings => {
        if (bookings.length === 0) {
          return of([]);
        }
        const vehicleRequests = bookings.map(booking =>
          this.vehicleService.getVehicle(booking.vehicleId).pipe(
            map(vehicle => ({
              booking: booking,
              vehicle: vehicle,
              daysRemaining: this.calculateDaysRemaining(booking.endDate)
            }))
          )
        );
        return forkJoin(vehicleRequests);
      })
    ).subscribe(detailedBookings => {
      this.bookingsWithDetails = detailedBookings;
      this.isLoading = false;
    });
  }

  /**
   * @method calculateDaysRemaining
   * @description Calculates the number of days remaining for a booking.
   * @param {Date} endDate - The end date of the booking.
   * @returns {number} The number of days remaining.
   */
  private calculateDaysRemaining(endDate: Date): number {
    const today = new Date();
    const end = new Date(endDate);
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const timeDiff = end.getTime() - today.getTime();
    if (timeDiff < 0) {
      return 0;
    }
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
}
