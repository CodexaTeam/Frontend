import { Booking } from '../models/booking.model';
import { BookingDto } from '../models/booking.dto';

export class BookingAssembler {
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
