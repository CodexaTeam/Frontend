import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Telemetry } from '../models/telemetry.model';
import { environment } from '../../../../environments/environment';

/**
 * @Injectable
 * @description Service for fetching vehicle telemetry data.
 */
@Injectable({
  providedIn: 'root'
})
export class TelemetryService {
  private apiUrl = environment.BASE_URL + '/telemetry';

  constructor(private http: HttpClient) { }

  /**
   * @method getTelemetryByVehicleId
   * @description Retrieves telemetry data for a specific vehicle.
   * @param {number} vehicleId - The ID of the vehicle.
   * @returns {Observable<Telemetry>} An observable of the telemetry data.
   */
  getTelemetryByVehicleId(vehicleId: number): Observable<Telemetry> {
    return this.http.get<Telemetry[]>(`${this.apiUrl}?vehicleId=${vehicleId}`).pipe(
      map(telemetryData => telemetryData[0])
    );
  }
}
