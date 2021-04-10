import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup;

  constructor(private fb: FormBuilder,
              private _authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  crearUsuario(){
    if(this.registroForm.invalid) return;
    const {nombre, correo, password} = this.registroForm.value;
    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading()
      }
    });

    this._authService.crearUsuario(nombre,correo,password)
      .then(credenciales => {
        Swal.close()
        this.router.navigate(['/']);
      })
      .catch(err => Swal.fire({
        icon: 'error',
        title: 'Oops ...',
        text: err.message
      }));
  }

  get nombre(){ return this.registroForm.get('nombre'); }
  get correo(){ return this.registroForm.get('correo'); }
  get password(){ return this.registroForm.get('password'); }

}
