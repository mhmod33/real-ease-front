import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';
export const guestGuard: CanActivateFn = (route, state) => {
  const authService=inject(AuthService)
  const router=inject(Router);

  if(authService.isAuthinticated()){
    router.navigate(['/dashboard'])
    return false
  }
  return true;
};
