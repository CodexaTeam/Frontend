import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, take } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { TranslateModule } from '@ngx-translate/core';

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

  enterEditMode(): void {
    this.isEditMode = true;
  }

  cancelEditMode(): void {
    this.isEditMode = false;
    if (this.currentUser) {
      this.infoForm.patchValue({
        name: this.currentUser.name,
        email: this.currentUser.email
      });
    }
  }

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

  logout(): void {
    this.authService.logout();
  }
}
