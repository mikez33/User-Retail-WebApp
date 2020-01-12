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

import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap, map, finalize, takeUntil} from 'rxjs/operators';
import { PostComponent } from '../../../components/pages/post/post.component';
import { AuthGuard } from '../../../services/auth.guard';

interface User {
	firstName: string;
	lastName: string;
	uid: string;
	email: string;
	photoURL?: string;
	displayName?: string;
	favoriteColor?: string;
	bio?: string;
	posts?: number;
	deleted?: [];
	followers?: string[];
	following?: string[];
}

@Component({
	selector: 'app-view-profile',
	templateUrl: './view-profile.component.html',
	styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
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
	displayName;
	firstName;
	lastName;
	email;
	followersArr;
	followingArr;
	deleted;
	bio;
	followers;
	following;
	isFollowing;
	isOwner;
	constructor(
		public auth: AuthService, 
		private afAuth: AngularFireAuth,
		private afs: AngularFirestore,
		private route: ActivatedRoute,
		public router: Router,
		public storage: AngularFireStorage,
		// private db : AngularFireDatabase, 
		// private afAuth : AngularFireAuth
		) {
		// this.db.database.ref().child("Users").on("value", (snapshot) => {
			//   this.photoURL = snapshot.val().photoURL;
			// })
			this.uid = this.route.snapshot.paramMap.get('id');
		}

		ngOnInit() {
			this.uid = this.route.snapshot.paramMap.get('id');
			this.auth.user.subscribe(user => {
				this.isOwner = user.uid === this.uid;
			});
			this.afs.doc<User>(`users/${this.uid}`).valueChanges().subscribe(user => {
				this.user = user;
				this.displayName = this.user.displayName;
				this.bio = this.user.bio;
				this.posts = this.user.posts;
				this.followers = this.user.followers.length;
      			this.following = this.user.following.length;
      			this.firstName = this.user.firstName;
				this.lastName = user.lastName;
				this.bio = user.bio;
				this.email = user.email;
				this.posts = user.posts;
				this.deleted = user.deleted;
				this.followersArr = this.user.followers;
				this.followingArr = this.user.following;
      			this.isFollowing = this.arrayContains(user.followers, this.afAuth.auth.currentUser.uid);
				let index= 0;
				for (let i = this.posts; i >= 1; i--) {
					if (!this.arrayContains(user.deleted, i.toString())) {
						const path = "profiles/" + this.uid + "/posts/post"
						this.postURL = this.storage.ref(path + i.toString() + "/1").getDownloadURL();
						this.postList[index] = {
							url: this.postURL,
							id: i,
						}
						index++;
					}
				}
			})
			this.profileSrc = this.storage.ref("profiles/" + this.uid + "/profile-photo")
			.getDownloadURL();
		}

		goTo(posts, uid) {
			this.router.navigate(['/post/' + 'cw40zIGCEkTXTK6ry2AWJf4gtBs1' + '-' + posts]);
		}

		// adds the current User's uid to the array of followers of the account user
		followUser(curr) {
			const currentUid = this.afAuth.auth.currentUser.uid;
			curr.following.push(this.uid);
			this.followersArr.push(currentUid);
			this.afs.doc(`users/${this.uid}`).set({
				firstName: this.firstName,
				lastName: this.lastName,
				displayName: this.displayName,
				email: this.email,
				uid: this.uid,
				bio: this.bio,
				posts: this.posts,
				deleted: this.deleted,
				followers: this.followersArr,
				following: this.followingArr,
			});
			this.afs.doc(`users/${currentUid}`).set({
				firstName: curr.firstName,
				lastName: curr.lastName,
				displayName: curr.displayName,
				email: curr.email,
				uid: currentUid,
				bio: curr.bio,
				posts: curr.posts,
				deleted: curr.deleted,
				followers: curr.followers,
				following: curr.following,
			});
			window.alert("Successfully Followed");
			this.router.navigate(['/account/' + this.uid]);
		}

		// Unfollows a user
		unFollowUser(curr) {
			const currentUid = this.afAuth.auth.currentUser.uid;
			const newFollowers = this.removeElement(this.followersArr, currentUid);
			const newFollowing = this.removeElement(this.followingArr, this.uid);
			this.afs.doc(`users/${this.uid}`).set({
				firstName: this.firstName,
				lastName: this.lastName,
				displayName: this.displayName,
				email: this.email,
				uid: this.uid,
				bio: this.bio,
				posts: this.posts,
				deleted: this.deleted,
				followers: newFollowers,
				following: this.followingArr,
			});
			this.afs.doc(`users/${currentUid}`).set({
				firstName: curr.firstName,
				lastName: curr.lastName,
				displayName: curr.displayName,
				email: curr.email,
				uid: currentUid,
				bio: curr.bio,
				posts: curr.posts,
				deleted: curr.deleted,
				followers: curr.followers,
				following: newFollowing,
			});
			window.alert("Successfully Unfollowed");
			this.router.navigate(['/account/' + this.uid]);
		}

		// returns true if element i is in array arr, otherwise false
		arrayContains(arr, i) {
			for (let index = 0; index < arr.length; index++) {
				if (arr[index] === i) {
					return true;
				}
			}
			return false;
		}

		// removes an element elt from array arr
		removeElement(arr, elt) {
			const index = arr.indexOf(elt);
			arr.splice(index, 1);
			// for (let i = 0; i < arr.length; i++) {
			// 	if (arr[i] === elt) {
			// 		arr.splice(i, 1);
			// 	}
			// }
			return arr;
		}

		// async setPosts() {
		// 	await this.auth.user.subscribe(user => {
		// 		return user.posts;
		// 	})
		// }

		// async getPosts() {
		// 	let promise = this.auth.user.subscribe(user => {
		// 		(user.posts);
		// 	});

		// 	this.posts = await promise;
		// }

		// async getUser(user) {
		// 	await user.subscribe(user => {
		// 		return user
		// 	});
		// }

		// getId() {
		// 	this.auth.getUid();
		// }

		// getImageURL(uid) {
			//   const filePath = "profiles/" + uid + "/profile-photo";
			//   // this.storageRef = this.storage.ref("profile: " + uid);
			//   // return this.storageRef.child("profile-photo").toString();
			//   // console.log(uid);
			//   console.log(filePath);
			//   return this.storage.ref(filePath).getDownloadURL();
			// }

		// 	editProfile() {
		// 		this.router.navigate(['edit_profile']);
		// 	}

		}
