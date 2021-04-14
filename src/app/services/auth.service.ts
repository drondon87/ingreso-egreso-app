import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { Usuario } from '../models/usuario.model';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';
import * as ingEgrActions from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;
  private _usuarioActivo: Usuario;

  get user(){
    return this._usuarioActivo
  }
  
  constructor(public auth: AngularFireAuth,
              private firestore: AngularFirestore,
              private store: Store<AppState>) { }

  initAuthListener(){
    this.auth.authState.subscribe(fuser =>  {
      if(fuser){
        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges().subscribe( (firestoreUser: any) => {
          const user = Usuario.fromFirebase(firestoreUser);
          this._usuarioActivo = user;
          this.store.dispatch( authActions.setUser({user}) );
        });
      }else{
        this._usuarioActivo = null;
        this.userSubscription.unsubscribe();
        this.store.dispatch( authActions.unSetUser());
        this.store.dispatch(ingEgrActions.unSetItems());
      }
      
    });
  }

  crearUsuario(nombre: string, email: string, password: string){
   return firebase.auth().createUserWithEmailAndPassword(email,password)
     .then(({user}) => {
        const newUser = new Usuario(user.uid,nombre,user.email);
        return this.firestore.doc(`${user.uid}/usuario`).set({...newUser})
     });
  }

  loginUsuario(email: string, password: string){
    return firebase.auth().signInWithEmailAndPassword(email,password);
  }

  logout(){
    return firebase.auth().signOut();
  }

  isAutenticado() {
   return this.auth.authState.pipe(
     map(fuser => fuser != null)
   );
  }
}
