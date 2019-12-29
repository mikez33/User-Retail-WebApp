import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';
// import { EditProfileComponent } from '../edit-profile/edit-profile.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  profileSrc;
  photoURL;
  storageRef;
  constructor(
  	public auth: AuthService, 
    public router: Router,
    public storage: AngularFireStorage,
    // private db : AngularFireDatabase, 
    // private afAuth : AngularFireAuth
  ) {
    // this.db.database.ref().child("Users").on("value", (snapshot) => {
    //   this.photoURL = snapshot.val().photoURL;
    // })
  }

  ngOnInit() {

  }

  getImageURL(uid: string) {
    this.storageRef = this.storage.ref("profile: " + uid);
    return this.storageRef.child("profile-photo").getDownloadURL().subscribe(url => {
      return url;
    });
  }

  editProfile() {
    this.router.navigate(['edit_profile']);
  }

}
