import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

/**
 * @Component
 * @description Component for the user login page.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  /**
   * @method onSubmit
   * @description Handles the form submission for user login.
   */
  onSubmit() {
    this.authService.login(this.email, this.password).subscribe();
  }
}
