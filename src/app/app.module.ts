import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// import { ngImgur } from 'ng-imgur';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsComponent } from './components/components.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { AboutComponent } from './components/pages/about/about.component';
import { HomeComponent } from './components/pages/home/home.component';
import { SuperSecretComponent } from './super-secret/super-secret.component';
import { AccountComponent } from './components/pages/account/account.component';
import { RegistrationComponent } from './components/pages/registration/registration.component';
import { LoginComponent } from './components/pages/login/login.component';
import { EditProfileComponent } from './components/pages/edit-profile/edit-profile.component';
import { CreatePostComponent } from './components/pages/create-post/create-post.component';
import { PostComponent } from './components/pages/post/post.component';
import { ViewProfileComponent } from './components/pages/view-profile/view-profile.component';

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
    AccountComponent,
    RegistrationComponent,
    LoginComponent,
    EditProfileComponent,
    CreatePostComponent,
    PostComponent,
    ViewProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
     // Initialize Firebase
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage  
    AngularFireDatabaseModule
  ],
  providers: [AngularFireDatabase, AngularFireStorage, EditProfileComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
