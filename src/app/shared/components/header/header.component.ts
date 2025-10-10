import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { AuthService } from '../../../features/iam/services/auth.service';
import { User } from '../../../features/iam/models/user.model';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

/**
 * @Component
 * @description The main header component of the application. It displays user information,
 * a logout button, and a menu toggle for mobile view.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LanguageSwitcherComponent, TranslateModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() menuToggleClicked = new EventEmitter<void>();

  currentUser$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  /**
   * @method logout
   * @description Logs out the current user by calling the AuthService.
   */
  logout() {
    this.authService.logout();
  }

  /**
   * @method onMenuToggle
   * @description Emits an event when the menu toggle button is clicked.
   */
  onMenuToggle(): void {
    this.menuToggleClicked.emit();
  }
}
