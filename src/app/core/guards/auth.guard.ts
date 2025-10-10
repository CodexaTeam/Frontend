import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/iam/services/auth.service';
import { map, take } from 'rxjs/operators';

/**
 * @function authGuard
 * @description A route guard that checks if a user is authenticated.
 * If the user is authenticated, it allows access to the route.
 * If not, it redirects the user to the login page.
 * @param {any} route - The route being activated.
 * @param {any} state - The router state.
 * @returns {boolean | Promise<boolean>} - True if the user can access the route, false otherwise.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    })
  );
};
