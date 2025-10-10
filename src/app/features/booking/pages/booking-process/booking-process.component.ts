import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Vehicle } from '../../../listings/models/vehicle.model';
import { VehicleService } from '../../../listings/services/vehicle.service';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../../iam/services/auth.service';
import { take } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

/**
 * @Component
 * @description This component handles the process of creating or renewing a vehicle booking.
 * It includes a form for selecting dates and calculates the total price.
 */
@Component({
  selector: 'app-booking-process',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './booking-process.component.html',
  styleUrls: ['./booking-process.component.css']
})
export class BookingProcessComponent implements OnInit {
  vehicle: Vehicle | undefined;
  bookingForm: FormGroup;
  totalPrice = 0;
  totalDays = 0;
  isEditMode = false;
  private bookingIdToEdit: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private bookingService: BookingService,
    private authService: AuthService
  ) {
    this.bookingForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  /**
   * @method ngOnInit
   * @description Initializes the component by fetching vehicle and booking data based on route parameters.
   * It determines whether the component is in 'edit' (renew) or 'create' mode.
   */
  ngOnInit(): void {
    const vehicleId = Number(this.route.snapshot.paramMap.get('vehicleId'));
    this.bookingIdToEdit = Number(this.route.snapshot.queryParamMap.get('bookingId'));

    this.vehicleService.getVehicle(vehicleId).subscribe(vehicle => {
      this.vehicle = vehicle;
    });

    if (this.bookingIdToEdit) {
      this.isEditMode = true;
      this.bookingService.getBookingById(this.bookingIdToEdit).subscribe(booking => {
        this.bookingForm.patchValue({
          startDate: formatDate(booking.startDate, 'yyyy-MM-dd', 'en-US'),
          endDate: formatDate(booking.endDate, 'yyyy-MM-dd', 'en-US')
        });
        this.bookingForm.get('startDate')?.disable();
        this.calculateTotal();
      });
    }
  }

  /**
   * @method calculateTotal
   * @description Calculates the total price of the booking based on the selected dates and the vehicle's daily rate.
   */
  calculateTotal() {
    const startDate = new Date(this.bookingForm.getRawValue().startDate);
    const endDate = new Date(this.bookingForm.value.endDate);
    if (this.vehicle && startDate && endDate && endDate > startDate) {
      const timeDiff = endDate.getTime() - startDate.getTime();
      this.totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      this.totalPrice = this.totalDays * this.vehicle.pricePerDay;
    } else {
      this.totalDays = 0;
      this.totalPrice = 0;
    }
  }

  /**
   * @method onSubmit
   * @description Handles the submission of the booking form.
   * It either updates an existing booking or creates a new one.
   */
  onSubmit() {
    if (this.bookingForm.invalid || !this.vehicle) return;

    if (this.isEditMode && this.bookingIdToEdit) {
      const bookingUpdate = {
        fechaFin: this.bookingForm.value.endDate,
        precioTotal: this.totalPrice,
      };
      this.bookingService.updateBooking(this.bookingIdToEdit, bookingUpdate).subscribe(() => {
        alert("¡Reserva actualizada con éxito!");
        this.router.navigate(['/my-bookings']);
      });
    } else {
      this.authService.currentUser$.pipe(take(1)).subscribe(user => {
        if (!user) {
          alert("Debes iniciar sesión para reservar.");
          this.router.navigate(['/login']);
          return;
        }
        const newBooking = {
          id: Date.now(),
          vehicleId: this.vehicle!.id,
          userId: user.id,
          fechaInicio: this.bookingForm.value.startDate,
          fechaFin: this.bookingForm.value.endDate,
          precioTotal: this.totalPrice,
          estado: 'activa' as const
        };
        this.bookingService.createBooking(newBooking).subscribe(() => {
          alert("¡Reserva confirmada con éxito!");
          this.router.navigate(['/my-bookings']);
        });
      });
    }
  }
}
