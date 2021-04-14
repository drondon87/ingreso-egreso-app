import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ingEgrActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs$: Subscription;
  ingresosSubs$: Subscription;

  constructor(private store: Store<AppState>,
              private _ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.userSubs$ = this.store.select('user')
    .pipe(
      filter(auth => auth.user != null)
    ).subscribe (({user}) => {
        this.ingresosSubs$ =  this._ingresoEgresoService.initIngresosEgresosListener(user.uid)
          .subscribe(ingresosEgresos => this.store.dispatch(ingEgrActions.setItems({items: ingresosEgresos})));
    });
  }

  ngOnDestroy(): void {
    this.userSubs$.unsubscribe();
    this.ingresosSubs$.unsubscribe();
  }

}
