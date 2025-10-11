import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../../iam/services/auth.service';
import { take } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

/**
 * @Component
 * @description This component displays a list of booking requests for the vehicles owned by the current user.
 */
@Component({
  selector: 'app-booking-requests',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './booking-requests.component.html',
  styleUrls: ['./booking-requests.component.css']
})
export class BookingRequestsComponent implements OnInit {
  bookingRequests: any[] = [];
  isLoading = true;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  /**
   * @method ngOnInit
   * @description On initialization, it fetches the booking requests for the current owner.
   */
  ngOnInit(): void {
    this.authService.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.bookingService.getBookingsForOwner(user.id).subscribe(data => {
          this.bookingRequests = data;
          this.isLoading = false;
        });
      }
    });
  }

  /**
   * @method cancelBooking
   * @description Cancels a booking and removes it from the list.
   * @param {number} bookingId - The ID of the booking to cancel.
   */
  cancelBooking(bookingId: number): void {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      this.bookingService.cancelBooking(bookingId).subscribe({
        next: () => {
          // Filtra la lista para eliminar la reserva cancelada de la vista
          this.bookingRequests = this.bookingRequests.filter(b => b.id !== bookingId);
          alert('Reserva cancelada con éxito.');
        },
        error: (err) => {
          console.error('Error al cancelar la reserva:', err);
          alert('Hubo un error al cancelar la reserva.');
        }
      });
    }
  }
}
