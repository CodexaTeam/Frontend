import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Booking } from '../../models/booking.model';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../../iam/services/auth.service';
import { VehicleService } from '../../../listings/services/vehicle.service';
import { switchMap, of, forkJoin, map } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

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
