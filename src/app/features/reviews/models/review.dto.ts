/**
 * @interface ReviewDto
 * @description Represents the data transfer object for a review.
 */
export interface ReviewDto {
  id: number;
  vehicleId: number;
  userId: number;
  rating: number;
  comment: string;
  userName?: string;
  date: string;
}
