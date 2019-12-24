import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList} from '@angular/fire/database';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsComponent } from './components/components.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { AboutComponent } from './components/pages/about/about.component';
import { HomeComponent } from './components/pages/home/home.component';
import { SuperSecretComponent } from './super-secret/super-secret.component';
import { AccountComponent } from './components/pages/account/account.component';

const firebaseConfig = {
    apiKey: "AIzaSyD8pPJNfaDDJdlkgN13onJlECW7uW9E610",
    authDomain: "user-retail-webapp.firebaseapp.com",
    databaseURL: "https://user-retail-webapp.firebaseio.com",
    projectId: "user-retail-webapp",
    storageBucket: "user-retail-webapp.appspot.com",
    messagingSenderId: "465093803970",
    appId: "1:465093803970:web:56ac290e2945290bb9a05b",
    measurementId: "G-6ZZE0HQKRB"
  };

@NgModule({
  declarations: [
    AppComponent,
    ComponentsComponent,
    HeaderComponent,
    AboutComponent,
    HomeComponent,
    SuperSecretComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
     // Initialize Firebase
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage  
    
  ],
  providers: [AngularFireDatabase],
  bootstrap: [AppComponent]
})
export class AppModule { }
