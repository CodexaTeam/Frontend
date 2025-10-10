import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Booking } from '../models/booking.model';
import { BookingDto } from '../models/booking.dto';
import { BookingAssembler } from '../assemblers/booking.assembler';
import { VehicleService } from '../../listings/services/vehicle.service';
import { environment } from '../../../../environments/environment';

/**
 * @Injectable
 * @description This service handles all operations related to bookings,
 * such as creating, retrieving, updating, and canceling them.
 */
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = environment.BASE_URL + environment.ENDPOINT_PATH_BOOKINGS;

  constructor(
    private http: HttpClient,
    private vehicleService: VehicleService
  ) {}

  /**
   * @method getBookingById
   * @description Retrieves a booking by its ID.
   * @param {number} id - The ID of the booking to retrieve.
   * @returns {Observable<Booking>} An observable of the Booking model.
   */
  getBookingById(id: number): Observable<Booking> {
    return this.http.get<BookingDto>(`${this.apiUrl}/${id}`).pipe(
      map(dto => BookingAssembler.toModel(dto))
    );
  }

  /**
   * @method updateBooking
   * @description Updates a booking with new data.
   * @param {number} bookingId - The ID of the booking to update.
   * @param {Partial<BookingDto>} bookingDto - A partial DTO with the fields to update.
   * @returns {Observable<Booking>} An observable of the updated Booking model.
   */
  updateBooking(bookingId: number, bookingDto: Partial<BookingDto>): Observable<Booking> {
    return this.http.patch<BookingDto>(`${this.apiUrl}/${bookingId}`, bookingDto).pipe(
      map(dto => BookingAssembler.toModel(dto))
    );
  }

  /**
   * @method cancelBooking
   * @description Cancels a booking, which also updates the vehicle's status to 'available'.
   * @param {number} bookingId - The ID of the booking to cancel.
   * @returns {Observable<any>} An observable of the HTTP response.
   */
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

  /**
   * @method deleteBooking
   * @description Deletes a booking permanently.
   * @param {number} bookingId - The ID of the booking to delete.
   * @returns {Observable<any>} An observable of the HTTP response.
   */
  deleteBooking(bookingId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${bookingId}`);
  }

  /**
   * @method getBookingsByUserId
   * @description Retrieves all bookings made by a specific user.
   * @param {number} userId - The ID of the user.
   * @returns {Observable<Booking[]>} An observable of an array of Booking models.
   */
  getBookingsByUserId(userId: number): Observable<Booking[]> {
    return this.http.get<BookingDto[]>(`${this.apiUrl}?userId=${userId}`).pipe(
      map(dtos => dtos.map(BookingAssembler.toModel))
    );
  }

  /**
   * @method createBooking
   * @description Creates a new booking and updates the vehicle's status to 'rented'.
   * @param {BookingDto} bookingDto - The DTO of the booking to create.
   * @returns {Observable<Booking>} An observable of the newly created Booking model.
   */
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

  /**
   * @method getBookingsForOwner
   * @description Retrieves all booking requests for vehicles owned by a specific user.
   * @param {number} ownerId - The ID of the owner.
   * @returns {Observable<any[]>} An observable of an array of booking requests.
   */
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
