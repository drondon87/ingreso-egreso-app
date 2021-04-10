import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _authService: AuthService,
              private router: Router){}

  canActivate() : Observable<boolean> {
    return this._authService.isAutenticado()
              .pipe(
                tap(estado => {
                  if(!estado){
                    this.router.navigate(['/login'])
                  }
                })
              );
  }
  
}
