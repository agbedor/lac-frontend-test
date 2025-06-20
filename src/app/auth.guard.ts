import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const accessToken = localStorage.getItem('access');
  if (accessToken) {
    return true;
  } else {
    // Redirect to login page if not authenticated
    window.location.href = '/landing';
    return false;
  }
};

