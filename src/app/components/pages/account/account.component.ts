import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Inject }  from '@angular/core';
import { DOCUMENT } from '@angular/common'; 
import { AfterViewInit, ElementRef, ViewChild} from '@angular/core';

import { AuthService } from '../../../services/auth.service';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
// import { EditProfileComponent } from '../edit-profile/edit-profile.component';

import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap, map, finalize, takeUntil} from 'rxjs/operators';
import { PostComponent } from '../../../components/pages/post/post.component';
import { AuthGuard } from '../../../services/auth.guard';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})

export class AccountComponent implements OnInit {
  postNums = [];
  postList = [];
  profileSrc;
  photoURL;
  uid;
  storageRef;
  postURL;
  posts;
  user;
  accountID;
  constructor(
  	public auth: AuthService, 
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    public router: Router,
    public storage: AngularFireStorage,
    public profile: EditProfileComponent
    // private db : AngularFireDatabase, 
    // private afAuth : AngularFireAuth
  ) {
    // this.db.database.ref().child("Users").on("value", (snapshot) => {
    //   this.photoURL = snapshot.val().photoURL;
    // })
    //this.uid = this.afAuth.auth.currentUser.uid;
  }

  ngOnInit() {
    this.uid = this.afAuth.auth.currentUser.uid;
    this.auth.user.subscribe(user => {
      this.user = user;
      this.posts = this.user.posts;
      let index= 0;
      for (let i = this.posts; i >= 1; i--) {
        const path = "profiles/" + this.uid + "/posts/post"
        this.postURL = this.storage.ref(path + i.toString() + "/1").getDownloadURL();
        this.postList[index] = {
          url: this.postURL,
          id: i,
        }
        index++;
      }
    })
    this.profileSrc = this.storage.ref("profiles/" + this.uid + "/profile-photo")
        .getDownloadURL();
  }

  goTo(posts, uid) {
    this.router.navigate(['/post/' + this.uid + '-' + posts]);
  }

  async setPosts() {
    await this.auth.user.subscribe(user => {
      return user.posts;
    })
  }

  async getPosts() {
    let promise = this.auth.user.subscribe(user => {
      (user.posts);
    });

    this.posts = await promise;
  }

  async getUser(user) {
    await user.subscribe(user => {
      return user
    });
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
