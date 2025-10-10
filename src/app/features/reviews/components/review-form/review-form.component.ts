import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../iam/services/auth.service';
import { take } from 'rxjs';
import { User } from '../../../iam/models/user.model';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review.model';

/**
 * @Component
 * @description A form component for users to submit reviews for a vehicle.
 */
@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit {
  @Input() vehicleId!: number;
  @Output() reviewPosted = new EventEmitter<void>();

  reviewForm: FormGroup;
  private currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private authService: AuthService
  ) {

    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1)]],
      comment: ['', Validators.required]
    });
  }

  /**
   * @method ngOnInit
   * @description Fetches the current user to associate with the review.
   */
  ngOnInit(): void {
    this.authService.currentUser$.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });
  }

  /**
   * @method setRating
   * @description Sets the rating value in the form.
   * @param {number} rating - The rating value.
   */
  setRating(rating: number) {
    this.reviewForm.get('rating')?.setValue(rating);
  }

  /**
   * @method onSubmit
   * @description Handles the submission of the review form.
   */
  onSubmit() {
    if (this.reviewForm.invalid || !this.currentUser) {
      alert('Por favor, completa la calificación y el comentario.');
      return;
    }

    const formValue = this.reviewForm.value;
    const newReview = new Review(
      Date.now(),
      this.vehicleId,
      this.currentUser.id,
      formValue.rating!,
      formValue.comment!
    );
    newReview.userName = this.currentUser.name;

    this.reviewService.postReview(newReview).subscribe({
      next: () => {
        alert('¡Gracias por tu opinión!');
        this.reviewPosted.emit();
        this.reviewForm.reset({ rating: 0, comment: '' });
      },
      error: (err: any) => {
        console.error('Error al enviar la reseña:', err);
        alert('Hubo un error al enviar la reseña.');
      }
    });
  }
}
