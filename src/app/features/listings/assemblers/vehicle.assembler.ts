import {Vehicle} from '../models/vehicle.model';
import {VehicleDto} from '../models/vehicle.dto';

/**
 * @class VehicleAssembler
 * @description A static class for converting between Vehicle DTOs and Vehicle domain models.
 */
export class VehicleAssembler {
  /**
   * @method toModel
   * @description Converts a VehicleDto to a Vehicle model.
   * @param {any} dto - The data transfer object.
   * @returns {Vehicle} The domain model instance.
   */
  static toModel(dto: any): Vehicle {
    return new Vehicle(
      dto.id,
      dto.brand,
      dto.model,
      dto.year,
      dto.pricePerDay,
      dto.status || dto.state,
      dto.imageUrl,
      dto.ownerId
    );
  }

  /**
   * @method toDto
   * @description Converts a Vehicle model to a VehicleDto.
   * @param {Vehicle} model - The domain model instance.
   * @returns {VehicleDto} The data transfer object.
   */
  static toDto(model: Vehicle): VehicleDto {
    const dto: any = {
      id: model.id,
      brand: model.brand,
      model: model.model,
      year: model.year,
      pricePerDay: model.pricePerDay,
      status: model.status,
      imageUrl: model.imageUrl,
      ownerId: model.ownerId
    };
    return dto;
  }
}
