import { Vehicle } from '../../../../../../../../../../../Desktop/codigo subir/Chirstian/app/features/listings/models/vehicle.model';
import { VehicleDto } from '../../../../../../../../../../../Desktop/codigo subir/Chirstian/app/features/listings/models/vehicle.dto';

export class VehicleAssembler {
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
