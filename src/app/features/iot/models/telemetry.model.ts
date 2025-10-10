/**
 * @interface Telemetry
 * @description Represents the telemetry data for a vehicle.
 */
export interface Telemetry {
  id: number;
  vehicleId: number;
  location: string;
  status: 'En movimiento' | 'Estacionado' | 'Apagado';
}
