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
}
