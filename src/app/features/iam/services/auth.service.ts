import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { UserDto } from '../models/user.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.BASE_URL + environment.ENDPOINT_PATH_USERS;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  public getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

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

  logout() {
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  register(userData: UserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user).pipe(
      tap(updatedUser => {
        this.currentUserSubject.next(updatedUser);
      })
    );
  }

  changePassword(userId: number, newPassword: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}`, { password: newPassword });
  }

  deleteAccount(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`).pipe(
      tap(() => {
        this.logout();
      })
    );
  }
}
