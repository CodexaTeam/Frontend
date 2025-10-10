import { Booking } from '../models/booking.model';
import { BookingDto } from '../models/booking.dto';

/**
 * @class BookingAssembler
 * @description A static class responsible for converting between Booking DTOs (Data Transfer Objects) and Booking domain models.
 */
export class BookingAssembler {
  /**
   * @method toModel
   * @description Converts a BookingDto object to a Booking domain model.
   * @param {BookingDto} dto - The data transfer object.
   * @returns {Booking} The domain model instance.
   */
  static toModel(dto: BookingDto): Booking {
    return new Booking(
      dto.id,
      dto.vehicleId,
      dto.userId,
      new Date(dto.fechaInicio),
      new Date(dto.fechaFin),
      dto.precioTotal,
      dto.estado
    );
  }
}
