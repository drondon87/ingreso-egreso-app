import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private _authService: AuthService,
              private router: Router) { }

  ngOnInit() {
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
