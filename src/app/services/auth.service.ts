import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList} from '@angular/fire/database';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from './user.model';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	user$: Observable<User>;
	// profilesRef: AngularFirestoreCollection<any[]>;
	// profiles: Observable<any[]>;

	constructor(
		private afAuth: AngularFireAuth,
		private afs: AngularFirestore,
		private router: Router,
		private db : AngularFireDatabase,
		//private component : AppComponent
	) { 
		// this.profilesRef = afs.collection<any[]>('users');
		// this.profiles = this.profilesRef.valueChanges();
		this.user$ = this.afAuth.authState.pipe(
			switchMap(user => {
				// Logged in
				if (user) {
					return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
				} 
				// Logged out
				else {
					return of(null);
				}
			})
		);



	}
	async googleSignIn() {
		const provider = new auth.GoogleAuthProvider();
		const credential = await this.afAuth.auth.signInWithPopup(provider);
		return this.updateUserData(credential.user);
	}

	async signOut() {
		await this.afAuth.auth.signOut()
		return this.router.navigate(['/']);
	}

	// private createUser(User) {
	// 	const this.profilesRef = this.db.list('users');
	// 	this.profilesRef.push("uid");
	// 	this.profilesRef.push("email");
	// 	this.profilesRef.push("displayName");
	// 	this.profilesRef.push("photoURL");
	// 	this.profilesRef.push("bio");
	// 	this.profilesRef.update("uid", User.uid);
	// 	this.profilesRef.update("email", User.email);
	// 	this.profilesRef.update("displayName", User.displayName);
	// 	this.profilesRef.update("photoURL", User.photoURL);
	// }

	private updateUserData(User) {
		const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${User.uid}`);
		//const profilesRef = this.afs.collection<any[]>('users');
		const data = {
			uid: User.uid, 
			email: User.email,
			displayName: User.displayName,
			photoURL: User.photoURL,
			bio: "ewerw" 
		};
		return userRef.set(data, {merge : true});
	}

	public currentUser() {
		return this.afAuth.auth.currentUser;
	}

	public userDisplayName() {
		const user = this.afAuth.auth.currentUser;
		if (user != null) {
			return user.displayName;
		} else {
			return "";
		}
	}

	public userPhotoURL() {
		const user = this.afAuth.auth.currentUser;
		if (user != null) {
			return user.photoURL;
		} else {
			return "";
		}
	}

	public userBio(User) {
		//const user = auth.GoogleAuthProvider().cre;
		const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${User.bio}`);
		let user: User = {
   			uid: User.uid, 
			email: User.email,
			displayName: User.displayName,
			photoURL: User.photoURL,
			bio: User.bio
		} 
		return user.bio
	}
}

