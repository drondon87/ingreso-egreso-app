import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private firestore: AngularFirestore,
              private _authService: AuthService) { }          

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso){
    const uidUser = this._authService.user.uid;
    const {descripcion, monto, tipo} = ingresoEgreso;
    return this.firestore.doc(`${uidUser}/ingresos-egresos`)
      .collection('items')
      .add({ descripcion, monto, tipo });
  }

  initIngresosEgresosListener(uid: string){
    return this.firestore.collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map(snapshot => 
          snapshot.map(doc => 
            ({
              uid: doc.payload.doc.id,
              ... doc.payload.doc.data() as any
            })
          )
        )
      );
  }

  borrarIngresoEgreso(uid: string){
    const uidUser = this._authService.user.uid;
    return this.firestore.doc(`${uidUser}/ingresos-egresos/items/${uid}`).delete();
  }

}
