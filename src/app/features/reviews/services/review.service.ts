import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Review } from '../models/review.model';
import { ReviewDto } from '../models/review.dto';
import { ReviewAssembler } from '../assemblers/review.assembler';
import { User } from '../../iam/models/user.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = environment.BASE_URL + environment.ENDPOINT_PATH_REVIEWS;
  private usersApiUrl = environment.BASE_URL + environment.ENDPOINT_PATH_USERS;

  constructor(private http: HttpClient) {}

  getReviewsByVehicleId(vehicleId: number): Observable<Review[]> {
    return this.http.get<ReviewDto[]>(`${this.apiUrl}?vehicleId=${vehicleId}`).pipe(
      map(dtos => dtos.map(ReviewAssembler.toModel))
    );
  }

  postReview(review: Review): Observable<Review> {
    const dto = ReviewAssembler.toDto(review);
    return this.http.post<ReviewDto>(this.apiUrl, dto).pipe(
      map(newDto => ReviewAssembler.toModel(newDto))
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersApiUrl);
  }
}
