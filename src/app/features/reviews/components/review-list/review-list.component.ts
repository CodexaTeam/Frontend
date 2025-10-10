import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, map } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import {ReviewService} from '../../services/review.service';
import {Review} from '../../models/review.model';

/**
 * @Component
 * @description This component displays a paginated list of reviews for a given vehicle.
 */
@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {
  @Input() vehicleId!: number;
  allReviews: Review[] = [];
  pagedReviews: Review[] = [];
  currentPage = 1;
  reviewsPerPage = 5;
  totalPages = 1;
  isLoading = true;

  constructor(private reviewService: ReviewService) {}

  /**
   * @method ngOnInit
   * @description Initializes the component by loading the reviews if a vehicleId is provided.
   */
  ngOnInit(): void {
    if (this.vehicleId) {
      this.loadReviews();
    }
  }

  /**
   * @method loadReviews
   * @description Fetches reviews and user data, then maps user names to the reviews.
   */
  public loadReviews(): void {
    this.isLoading = true;
    const reviews$ = this.reviewService.getReviewsByVehicleId(this.vehicleId);
    const users$ = this.reviewService.getUsers();

    forkJoin({ reviews: reviews$, users: users$ }).pipe(
      map(({ reviews, users }) => {
        const userMap = new Map<number, string>(users.map(u => [u.id, u.name]));

        reviews.forEach(review => {
          review.userName = userMap.get(review.userId) || 'Usuario Anónimo';
        });

        return reviews.sort((a, b) => b.id - a.id);
      })
    ).subscribe(reviewsWithNames => {
      this.allReviews = reviewsWithNames;
      this.totalPages = Math.ceil(this.allReviews.length / this.reviewsPerPage);
      this.updatePagedReviews();
      this.isLoading = false;
    });
  }

  /**
   * @method updatePagedReviews
   * @description Updates the list of reviews displayed for the current page.
   */
  updatePagedReviews(): void {
    const startIndex = (this.currentPage - 1) * this.reviewsPerPage;
    const endIndex = startIndex + this.reviewsPerPage;
    this.pagedReviews = this.allReviews.slice(startIndex, endIndex);
  }

  /**
   * @method goToPage
   * @description Navigates to a specific page of reviews.
   * @param {number} page - The page number to navigate to.
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedReviews();
    }
  }
}
