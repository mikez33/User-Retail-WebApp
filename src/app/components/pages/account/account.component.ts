import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
// import { EditProfileComponent } from '../edit-profile/edit-profile.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  profileSrc;
  photoURL;
  uid;
  storageRef;
  constructor(
  	public auth: AuthService, 
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    public router: Router,
    public storage: AngularFireStorage,
    public profile: EditProfileComponent
    // private db : AngularFireDatabase, 
    // private afAuth : AngularFireAuth
  ) {
    // this.db.database.ref().child("Users").on("value", (snapshot) => {
    //   this.photoURL = snapshot.val().photoURL;
    // })
    this.uid = this.afAuth.auth.currentUser.uid;
    // console.log(this.uid);
    this.profileSrc = this.storage.ref("profiles/" + this.uid + "/profile-photo")
        .getDownloadURL();
  }

  ngOnInit() {

  }

  getId() {
    this.auth.getUid();
  }

  // getImageURL(uid) {
  //   const filePath = "profiles/" + uid + "/profile-photo";
  //   // this.storageRef = this.storage.ref("profile: " + uid);
  //   // return this.storageRef.child("profile-photo").toString();
  //   // console.log(uid);
  //   console.log(filePath);
  //   return this.storage.ref(filePath).getDownloadURL();
  // }

  editProfile() {
    this.router.navigate(['edit_profile']);
  }

}
