import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vehicle } from '../models/vehicle.model';
import { VehicleDto } from '../models/vehicle.dto';
import { VehicleAssembler } from '../assemblers/vehicle.assembler';
import { environment } from '../../../../environments/environment';

/**
 * @Injectable
 * @description Service for managing vehicle-related operations, such as fetching,
 * creating, and updating vehicles.
 */
@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = environment.BASE_URL + environment.ENDPOINT_PATH_VEHICLES;

  constructor(private http: HttpClient) {}

  /**
   * @method getVehicles
   * @description Retrieves a list of all vehicles.
   * @returns {Observable<Vehicle[]>} An observable of an array of Vehicle models.
   */
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<VehicleDto[]>(this.apiUrl).pipe(
      map(dtos => dtos.map(VehicleAssembler.toModel))
    );
  }

  /**
   * @method getVehicle
   * @description Retrieves a single vehicle by its ID.
   * @param {number} id - The ID of the vehicle.
   * @returns {Observable<Vehicle>} An observable of a Vehicle model.
   */
  getVehicle(id: number): Observable<Vehicle> {
    return this.http.get<VehicleDto>(`${this.apiUrl}/${id}`).pipe(
      map(dto => VehicleAssembler.toModel(dto))
    );
  }

  /**
   * @method getVehiclesByOwnerId
   * @description Retrieves all vehicles owned by a specific user.
   * @param {number} ownerId - The ID of the vehicle owner.
   * @returns {Observable<Vehicle[]>} An observable of an array of Vehicle models.
   */
  getVehiclesByOwnerId(ownerId: number): Observable<Vehicle[]> {
    return this.http.get<VehicleDto[]>(`${this.apiUrl}?ownerId=${ownerId}`).pipe(
      map(dtos => dtos.map(VehicleAssembler.toModel))
    );
  }

  /**
   * @method createVehicle
   * @description Creates a new vehicle.
   * @param {Vehicle} vehicle - The Vehicle model to create.
   * @returns {Observable<Vehicle>} An observable of the newly created Vehicle model.
   */
  createVehicle(vehicle: Vehicle): Observable<Vehicle> {
    const dto = VehicleAssembler.toDto(vehicle);
    return this.http.post<VehicleDto>(this.apiUrl, dto).pipe(
      map(newDto => VehicleAssembler.toModel(newDto))
    );
  }

  /**
   * @method updateVehicle
   * @description Updates an existing vehicle.
   * @param {Vehicle} vehicle - The Vehicle model to update.
   * @returns {Observable<Vehicle>} An observable of the updated Vehicle model.
   */
  updateVehicle(vehicle: Vehicle): Observable<Vehicle> {
    const dto = VehicleAssembler.toDto(vehicle);
    return this.http.put<VehicleDto>(`${this.apiUrl}/${vehicle.id}`, dto).pipe(
      map(updatedDto => VehicleAssembler.toModel(updatedDto))
    );
  }
}
