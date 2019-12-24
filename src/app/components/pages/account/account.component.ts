import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList} from '@angular/fire/database';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  photoURL;
  constructor(
  	public authService: AuthService, 
    private db : AngularFireDatabase, 
    private afAuth : AngularFireAuth
  ) {
    this.db.database.ref().child("Users").on("value", (snapshot) => {
      this.photoURL = snapshot.val().photoURL;
    })
  }

  ngOnInit() {
  }

  public getDisplayName() {
  	return this.authService.userDisplayName();
  }

  public getPhotoURL() {
  	return this.photoURL;
  }

  public getBio() {
  	
  }

}
