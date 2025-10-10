export interface BookingDto {
  id: number;
  vehicleId: number;
  userId: number;
  fechaInicio: string;
  fechaFin: string;
  precioTotal: number;
  estado: 'activa' | 'finalizada' | 'cancelada';
}
