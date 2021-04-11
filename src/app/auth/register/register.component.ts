import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ui from '../../shared/ui.actions';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  uiSubscription: Subscription;
  cargando: boolean = false;

  constructor(private fb: FormBuilder,
              private _authService: AuthService,
              private router: Router,
              private store: Store<AppState>) { }

  ngOnInit() {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.uiSubscription = this.store.select('ui').subscribe(ui => this.cargando = ui.isLoading);
  }

  ngOnDestroy() {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario(){
    if(this.registroForm.invalid) {return;}

    this.store.dispatch(ui.isLoading());

    const {nombre, correo, password} = this.registroForm.value;
    /* Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading()
      }
    }); */

    this._authService.crearUsuario(nombre,correo,password)
      .then(credenciales => {
        //Swal.close()
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
      })
      .catch(err => {
        this.store.dispatch(ui.stopLoading());
        Swal.fire({
        icon: 'error',
        title: 'Oops ...',
        text: err.message
      })});
  }

  get nombre(){ return this.registroForm.get('nombre'); }
  get correo(){ return this.registroForm.get('correo'); }
  get password(){ return this.registroForm.get('password'); }

}
