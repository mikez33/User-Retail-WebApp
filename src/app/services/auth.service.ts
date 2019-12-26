import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap} from 'rxjs/operators';

interface User {
	uid: string;
	email: string;
	photoURL?: string;
	displayName?: string;
	favoriteColor?: string;
	bio?: string;
}


@Injectable({ providedIn: 'root' })
export class AuthService {

	user: Observable<User>;
	newUser: User;
	private eventAuthError = new BehaviorSubject<string>("");
	eventAuthError$= this.eventAuthError.asObservable();

	constructor(
		private afAuth: AngularFireAuth,
		private afs: AngularFirestore,
		private router: Router
		) {

		//// Get auth data, then get firestore user document || null
		this.user = this.afAuth.authState.pipe(
			switchMap(user => {
				if (user) {
					return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
				} else {
					return of(null)
				}
			})
			)
	}

	getUserState() {
		return this.afAuth.authState;
	}

	createUser(user) {
		this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
			.then(userCredential => {
				this.newUser = user;	
				console.log(userCredential);
				userCredential.user.updateProfile({
					displayName: user.firstName + ' ' + user.lastName
				});

				this.insertUserData(userCredential, user.firstName, user.lastName)
					.then(() => {
						this.router.navigate(['/home'])
					});
			})
			.catch(error => {
				this.eventAuthError.next(error);
			});
	}

	insertUserData(userCredential: firebase.auth.UserCredential, first: string, last: string) {
		return this.afs.doc(`users/${userCredential.user.uid}`).set({
			displayName: first + ' ' + last,
			email: this.newUser.email, 
			uid: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
			bio: "this is the default bio",
			photoURL: "https://i.stack.imgur.com/dr5qp.jpg",
		});
	}

	normalLogin(email: string, password: string) {
		this.afAuth.auth.signInWithEmailAndPassword(email, password)
			.catch(error => {
				this.eventAuthError.next(error);
			})
			.then(userCredential => {
				if (userCredential) {
					this.router.navigate(['/home']);
				}
			});
	}

	googleLogin() {
		const provider = new auth.GoogleAuthProvider()
		return this.oAuthLogin(provider);
	}

	private oAuthLogin(provider) {
		return this.afAuth.auth.signInWithPopup(provider)
		.then((credential) => {
			this.updateUserData(credential.user)
			this.router.navigate(['home'])
		})
	}


	private updateUserData(user) {
		// Sets user data to firestore on login

		const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

		const data: User = {
			uid: user.uid,
			email: user.email,
			displayName: user.displayName,
			photoURL: user.photoURL,
			bio: "this is the default bio"
		}

		return userRef.set(data, { merge: true })

	}


	signOut() {
		this.afAuth.auth.signOut().then(() => {
			this.router.navigate(['/']);
		});
	}
}