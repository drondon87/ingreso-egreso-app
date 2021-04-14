import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import * as ui from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styleUrls: ['./ingreso-egreso.component.css']
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;
  cargando: boolean = false;
  tipo: string = 'ingreso';
  $loadingSubs: Subscription;
  
  constructor(private fb: FormBuilder,
              private _ingresoEgresoService: IngresoEgresoService,
              private store: Store<AppState>) { }

  ngOnInit() {
    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required]
    });

    this.$loadingSubs = this.store.select('ui').subscribe(({isLoading}) => this.cargando = isLoading);
  }

  ngOnDestroy() {
    this.$loadingSubs.unsubscribe();
  }

  guardarIngresoEgreso(){
    
    if(this.ingresoForm.invalid){return;}
    
    this.store.dispatch(ui.isLoading());

    const {descripcion, monto} = this.ingresoForm.value;

    const ingresoEgreso = new IngresoEgreso(descripcion,monto,this.tipo);
    
    this._ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
      .then( () => { 
        this.store.dispatch(ui.stopLoading());
        this.ingresoForm.reset();
        Swal.fire('Registro Creado',descripcion,'success');
      })
      .catch(err => {
        this.store.dispatch(ui.stopLoading());
        Swal.fire({
        icon: 'error',
        title: 'Oops ...',
        text: err.message
      })});
  }

}
