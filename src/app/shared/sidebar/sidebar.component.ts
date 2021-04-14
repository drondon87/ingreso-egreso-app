import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombre: string = '';
  userSubs$: Subscription;
  
  constructor(private _authService: AuthService,
              private router: Router,
              private store: Store<AppState>) { }

  ngOnInit() {
    this.userSubs$ = this.store.select('user')
      .pipe(
        filter(({user}) => user != null)
      )
      .subscribe( ({user}) => this.nombre = user.nombre);
  }

  ngOnDestroy(): void {
    this.userSubs$.unsubscribe();
  }

  cerrarSesion(){
    Swal.fire({
      title: 'Cerrando Sesión ...',
      didOpen: () => {
        Swal.showLoading()
      }
    });
    this._authService.logout()
    .then( () => {
      Swal.close();
      this.router.navigate(['/login']);
    })
    .catch(err => Swal.fire({
      icon: 'error',
      title: 'Oops ...',
      text: err.message
    }));
  }

}
