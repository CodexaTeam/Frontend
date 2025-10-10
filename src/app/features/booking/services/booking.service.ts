import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Booking } from '../models/booking.model';
import { BookingDto } from '../models/booking.dto';
import { BookingAssembler } from '../assemblers/booking.assembler';
import { VehicleService } from '../../listings/services/vehicle.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = environment.BASE_URL + environment.ENDPOINT_PATH_BOOKINGS;

  constructor(
    private http: HttpClient,
    private vehicleService: VehicleService
  ) {}

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<BookingDto>(`${this.apiUrl}/${id}`).pipe(
      map(dto => BookingAssembler.toModel(dto))
    );
  }

  // ... (otros métodos como getBookingsByUserId, createBooking, etc. se mantienen igual)
  updateBooking(bookingId: number, bookingDto: Partial<BookingDto>): Observable<Booking> {
    return this.http.patch<BookingDto>(`${this.apiUrl}/${bookingId}`, bookingDto).pipe(
      map(dto => BookingAssembler.toModel(dto))
    );
  }

  cancelBooking(bookingId: number): Observable<any> {
    return this.http.get<BookingDto>(`${this.apiUrl}/${bookingId}`).pipe(
      switchMap(bookingToCancel => {
        return this.vehicleService.getVehicle(bookingToCancel.vehicleId).pipe(
          switchMap(vehicle => {
            vehicle.status = 'available';
            return this.vehicleService.updateVehicle(vehicle);
          }),
          switchMap(() => {
            const updatedBookingFields = { estado: 'cancelada' as const };
            return this.http.patch<BookingDto>(`${this.apiUrl}/${bookingId}`, updatedBookingFields);
          })
        );
      })
    );
  }

  deleteBooking(bookingId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${bookingId}`);
  }

  getBookingsByUserId(userId: number): Observable<Booking[]> {
    return this.http.get<BookingDto[]>(`${this.apiUrl}?userId=${userId}`).pipe(
      map(dtos => dtos.map(BookingAssembler.toModel))
    );
  }

  createBooking(bookingDto: BookingDto): Observable<Booking> {
    return this.vehicleService.getVehicle(bookingDto.vehicleId).pipe(
      switchMap(vehicle => {
        vehicle.status = 'rented';
        return this.vehicleService.updateVehicle(vehicle);
      }),
      switchMap(() => {
        return this.http.post<BookingDto>(this.apiUrl, bookingDto).pipe(
          map(dto => BookingAssembler.toModel(dto))
        );
      })
    );
  }

  getBookingsForOwner(ownerId: number): Observable<any[]> {
    return this.vehicleService.getVehiclesByOwnerId(ownerId).pipe(
      switchMap(vehicles => {
        if (vehicles.length === 0) return of([]);
        const bookingRequests = vehicles.map(vehicle =>
          this.http.get<BookingDto[]>(`${this.apiUrl}?vehicleId=${vehicle.id}`).pipe(
            map(bookings => bookings.map(booking => ({ ...booking, vehicle })))
          )
        );
        return forkJoin(bookingRequests).pipe(map(results => results.flat()));
      })
    );
  }
}
