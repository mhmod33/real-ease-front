import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authorizationGuard: CanActivateChildFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
    if(authService.getToken() &&authService.getUserRole()=='admin' ){
        return true;
    }
    else{
        router.navigate(['/unauthorized']);
    }

  return true;
};