import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(
  	public authService: AuthService,
  ) {}

  ngOnInit() {
  }

  public getDisplayName() {
  	return this.authService.userDisplayName();
  }

  public getPhotoURL() {
  	return this.authService.userPhotoURL();
  }

  public getBio() {
  	return this.authService.userBio(this.authService.user$);
  }

}
