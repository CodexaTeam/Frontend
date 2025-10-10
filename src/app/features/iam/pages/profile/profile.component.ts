import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, take } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { TranslateModule } from '@ngx-translate/core';

/**
 * @Component
 * @description Component for the user profile page, allowing users to view and edit their information,
 * change their password, and delete their account.
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser$: Observable<User | null>;
  currentUser: User | null = null;

  infoForm: FormGroup;
  passwordForm: FormGroup;
  isEditMode = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.currentUser$ = this.authService.currentUser$;

    this.infoForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  /**
   * @method ngOnInit
   * @description Initializes the component by fetching the current user's data.
   */
  ngOnInit(): void {
    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.infoForm.patchValue({
          name: user.name,
          email: user.email
        });
      }
    });
  }

  /**
   * @method enterEditMode
   * @description Enters edit mode to allow the user to modify their information.
   */
  enterEditMode(): void {
    this.isEditMode = true;
  }

  /**
   * @method cancelEditMode
   * @description Cancels edit mode and reverts any changes made to the user's information.
   */
  cancelEditMode(): void {
    this.isEditMode = false;
    if (this.currentUser) {
      this.infoForm.patchValue({
        name: this.currentUser.name,
        email: this.currentUser.email
      });
    }
  }

  /**
   * @method onUpdateInformation
   * @description Handles the submission of the user information update form.
   */
  onUpdateInformation(): void {
    if (this.infoForm.invalid || !this.currentUser) return;

    const updatedUser: User = { ...this.currentUser, ...this.infoForm.value };

    this.authService.updateUser(updatedUser).subscribe({
      next: () => {
        alert('Información actualizada con éxito.');
        this.isEditMode = false;
      },
      error: (err) => alert('Hubo un error al actualizar tus datos.')
    });
  }

  /**
   * @method onChangePassword
   * @description Handles the submission of the password change form.
   */
  onChangePassword(): void {
    if (this.passwordForm.invalid || !this.currentUser) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      alert('La nueva contraseña y su confirmación no coinciden.');
      return;
    }

    this.authService.login(this.currentUser.email, currentPassword).subscribe(users => {
      if (users.length === 0) {
        alert('La contraseña actual es incorrecta.');
        return;
      }

      this.authService.changePassword(this.currentUser!.id, newPassword).subscribe({
        next: () => {
          alert('Contraseña cambiada con éxito.');
          this.passwordForm.reset();
        },
        error: (err) => alert('Hubo un error al cambiar la contraseña.')
      });
    });
  }

  /**
   * @method deleteAccount
   * @description Deletes the user's account after confirming their identity.
   */
  deleteAccount(): void {
    if (!this.currentUser) return;

    const confirmation = prompt('Esta acción es permanente. Para confirmar, escribe tu email:');
    if (confirmation === this.currentUser.email) {
      this.authService.deleteAccount(this.currentUser.id).subscribe({
        next: () => {
          alert('Tu cuenta ha sido eliminada.');
        },
        error: (err) => alert('Hubo un error al eliminar tu cuenta.')
      });
    } else if (confirmation !== null) {
      alert('El email no coincide. La operación ha sido cancelada.');
    }
  }

  /**
   * @method logout
   * @description Logs out the current user.
   */
  logout(): void {
    this.authService.logout();
  }
}
