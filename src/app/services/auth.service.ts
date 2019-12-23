import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	user$: Observable<User>;

	constructor(
		private afAuth: AngularFireAuth,
		private afs: AngularFirestore,
		private router: Router
	) { 
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
		await this.afAuth.auth.signOut();
		return this.router.navigate(['/']);
	}

	private updateUserData(User) {
		const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${User.uid}`);

		const data = {
			uid: User.uid, 
			email: User.email,
			displayName: User.displayName,
			photoURL: User.photoURL
		};

		return userRef.set(data, {merge: true});
	}
}

