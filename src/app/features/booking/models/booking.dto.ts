/**
 * @interface BookingDto
 * @description Represents the data transfer object for a booking.
 */
export interface BookingDto {
  id: number;
  vehicleId: number;
  userId: number;
  fechaInicio: string;
  fechaFin: string;
  precioTotal: number;
  estado: 'activa' | 'finalizada' | 'cancelada';
}
