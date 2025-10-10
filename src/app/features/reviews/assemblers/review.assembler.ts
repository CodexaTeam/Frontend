import { Review } from '../models/review.model';
import { ReviewDto } from '../models/review.dto';

/**
 * @class ReviewAssembler
 * @description A static class for converting between Review DTOs and Review domain models.
 */
export class ReviewAssembler {
  /**
   * @method toModel
   * @description Converts a ReviewDto to a Review model.
   * @param {ReviewDto} dto - The data transfer object.
   * @returns {Review} The domain model instance.
   */
  static toModel(dto: ReviewDto): Review {
    const model = new Review(
      dto.id,
      dto.vehicleId,
      dto.userId,
      dto.rating,
      dto.comment
    );
    model.userName = dto.userName;
    model.date = new Date(dto.date);
    return model;
  }

  /**
   * @method toDto
   * @description Converts a Review model to a ReviewDto.
   * @param {Review} model - The domain model instance.
   * @returns {ReviewDto} The data transfer object.
   */
  static toDto(model: Review): ReviewDto {
    return {
      id: model.id,
      vehicleId: model.vehicleId,
      userId: model.userId,
      rating: model.rating,
      comment: model.comment,
      userName: model.userName,
      date: model.date.toISOString()
    };
  }
}
