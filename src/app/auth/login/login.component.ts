import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
              private _authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      correo: ['',Validators.required],
      password: ['', Validators.required]
    });
  }

  usuarioLogin(){
    const {correo, password} = this.loginForm.value;
    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading()
      }
    });

    this._authService.loginUsuario(correo,password)
      .then(usuario => {
        console.log(usuario);
        Swal.close()
        this.router.navigate(['/']);
      })
      .catch(err => Swal.fire({
        icon: 'error',
        title: 'Oops ...',
        text: err.message
      }));
  }

}
