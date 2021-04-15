import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate , CanLoad{

  constructor(private _authService: AuthService,
              private router: Router){}


  canLoad(): Observable<boolean> {
    return this._authService.isAutenticado()
              .pipe(
                tap(estado => {
                  if(!estado){
                    this.router.navigate(['/login'])
                  }
                }),
                take(1)
              );
  }

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
