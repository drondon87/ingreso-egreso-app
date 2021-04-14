import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosEgresosSubs$: Subscription;

  constructor(private store: Store<AppState>,
              private _ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.ingresosEgresosSubs$ =  this.store.select('ingresosEgresos').subscribe( ({items}) => this.ingresosEgresos = items );
  }

  ngOnDestroy(): void {
    this.ingresosEgresosSubs$.unsubscribe();
  }

  borrar(uid:string){
    this._ingresoEgresoService.borrarIngresoEgreso(uid)
      .then(() => { 
        Swal.fire('Borrado','Item Borrado','warning');
      })
      .catch(err => {
        Swal.fire({
        icon: 'error',
        title: 'Oops ...',
        text: err.message
      })})
  }

}
