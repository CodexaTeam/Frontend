import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { switchMap } from 'rxjs';
import { Booking } from '../../models/booking.model';
import { Vehicle } from '../../../listings/models/vehicle.model';
import { BookingService } from '../../services/booking.service';
import { VehicleService } from '../../../listings/services/vehicle.service';
import { ReviewListComponent } from '../../../reviews/components/review-list/review-list.component';
import { ReviewFormComponent } from '../../../reviews/components/review-form/review-form.component';
import { TranslateModule } from '@ngx-translate/core';

/**
 * @Component
 * @description This component displays the details of a specific booking, allowing the user to manage it (e.g., cancel, renew).
 * It also includes review components for the associated vehicle.
 */
@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, ReviewListComponent, ReviewFormComponent, TranslateModule],
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css']
})
export class BookingDetailComponent implements OnInit {
  @ViewChild(ReviewListComponent) private reviewList!: ReviewListComponent;

  booking: Booking | undefined;
  vehicle: Vehicle | undefined;
  daysRemaining: number | undefined;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private vehicleService: VehicleService
  ) {}

  /**
   * @method ngOnInit
   * @description Initializes the component by fetching the booking and vehicle details based on the route parameter.
   */
  ngOnInit(): void {
    const bookingId = Number(this.route.snapshot.paramMap.get('id'));
    if (bookingId) {
      this.bookingService.getBookingById(bookingId).pipe(
        switchMap(booking => {
          this.booking = booking;
          this.daysRemaining = this.calculateDaysRemaining(booking.endDate);
          return this.vehicleService.getVehicle(booking.vehicleId);
        })
      ).subscribe(vehicle => {
        this.vehicle = vehicle;
        this.isLoading = false;
      });
    }
  }

  /**
   * @method onReviewPosted
   * @description Handles the event emitted when a new review is posted, and reloads the review list.
   */
  onReviewPosted(): void {
    alert('¡Gracias por tu opinión!');
    if (this.reviewList) {
      this.reviewList.loadReviews();
    }
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

  /**
   * @method cancelBooking
   * @description Cancels and deletes the current booking after user confirmation.
   */
  cancelBooking(): void {
    if (this.booking && confirm('¿Estás seguro de que deseas cancelar esta reserva? Esta acción la eliminará permanentemente.')) {
      this.bookingService.cancelBooking(this.booking.id).subscribe({
        next: () => {
          alert('Reserva cancelada con éxito.');
          // Actualizamos el estado de la reserva en la vista actual
          if (this.booking) {
            this.booking.status = 'cancelada';
          }
        },
        error: (err) => {
          console.error('Error al cancelar la reserva:', err);
          alert('No se pudo cancelar la reserva. Inténtalo de nuevo.');
        }
      });
    }
  }

  /**
   * @method renewBooking
   * @description Navigates to the booking process page to renew the current booking.
   */
  renewBooking(): void {
    if (this.booking) {
      this.router.navigate(['/booking', this.booking.vehicleId], { queryParams: { bookingId: this.booking.id } });
    }
  }

  /**
   * @method deleteBooking
   * @description Deletes the current booking from the history after user confirmation.
   */
  deleteBooking(): void {
    if (this.booking && confirm('¿Estás seguro de que deseas eliminar permanentemente esta reserva del historial?')) {
      this.bookingService.deleteBooking(this.booking.id).subscribe({
        next: () => {
          alert('La reserva ha sido eliminada.');
          this.router.navigate(['/my-bookings']);
        },
        error: (err) => {
          console.error('Error al eliminar la reserva:', err);
          alert('No se pudo eliminar la reserva.');
        }
      });
    }
  }
}
