import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    }

    localStorage.setItem('redirectTo', state.url);

    return this.router.createUrlTree(['/login'], {
      queryParams: { redirectTo: state.url }
    });
  }
}
