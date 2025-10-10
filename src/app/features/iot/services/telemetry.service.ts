import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Telemetry } from '../models/telemetry.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {
  private apiUrl = environment.BASE_URL + '/telemetry';

  constructor(private http: HttpClient) { }

  getTelemetryByVehicleId(vehicleId: number): Observable<Telemetry> {
    return this.http.get<Telemetry[]>(`${this.apiUrl}?vehicleId=${vehicleId}`).pipe(
      map(telemetryData => telemetryData[0])
    );
  }
}
