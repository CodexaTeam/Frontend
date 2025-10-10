/**
 * @class Booking
 * @description Represents the domain model for a booking.
 */
export class Booking {
  constructor(
    public id: number,
    public vehicleId: number,
    public userId: number,
    public startDate: Date,
    public endDate: Date,
    public totalPrice: number,
    public status: 'activa' | 'finalizada' | 'cancelada'
  ) {}
}
