import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { UserDto } from '../models/user.dto';

/**
 * @Injectable
 * @description Service responsible for authentication-related operations such as login, logout,
 * registration, and user session management.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.BASE_URL + environment.ENDPOINT_PATH_USERS;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * @method getCurrentUser
   * @description Gets the current logged-in user.
   * @returns {User | null} The current user or null if not logged in.
   */
  public getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * @method login
   * @description Authenticates a user with the provided email and password.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Observable<User[]>} An observable of the user array.
   */
  login(email: string, password: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      tap(users => {
        if (users.length > 0) {
          const user = users[0];
          this.currentUserSubject.next(user);
          if (user.role === 'arrendador') {
            this.router.navigate(['/my-vehicles']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        } else {
          alert('Credenciales incorrectas');
        }
      })
    );
  }

  /**
   * @method logout
   * @description Logs out the current user and navigates to the login page.
   */
  logout() {
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * @method register
   * @description Registers a new user.
   * @param {UserDto} userData - The user data transfer object.
   * @returns {Observable<User>} An observable of the newly created user.
   */
  register(userData: UserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }

  /**
   * @method updateUser
   * @description Updates a user's information.
   * @param {User} user - The user object with updated information.
   * @returns {Observable<User>} An observable of the updated user.
   */
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user).pipe(
      tap(updatedUser => {
        this.currentUserSubject.next(updatedUser);
      })
    );
  }

  /**
   * @method changePassword
   * @description Changes a user's password.
   * @param {number} userId - The ID of the user.
   * @param {string} newPassword - The new password.
   * @returns {Observable<any>} An observable of the HTTP response.
   */
  changePassword(userId: number, newPassword: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}`, { password: newPassword });
  }

  /**
   * @method deleteAccount
   * @description Deletes a user's account.
   * @param {number} userId - The ID of the user to delete.
   * @returns {Observable<any>} An observable of the HTTP response.
   */
  deleteAccount(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`).pipe(
      tap(() => {
        this.logout();
      })
    );
  }
}
