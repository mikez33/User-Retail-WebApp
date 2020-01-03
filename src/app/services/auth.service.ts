import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase';

import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap} from 'rxjs/operators';

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
		private router: Router,
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

	update(user, prev: User) {
		const curr = this.afAuth.auth.currentUser;
		return this.afs.doc(`users/${curr.uid}`).set({
			firstName: (user.firstName === "") ? prev.firstName: user.firstName,
			lastName: (user.lastName === "") ? prev.lastName: user.lastName,
			displayName: this.getDisplayName(user, prev),
			email: (user.email === "") ? prev.email : user.email,
			uid: curr.uid,
			bio: (user.bio === "") ? prev.bio : user.bio,
			posts: prev.posts,
			deleted: prev.deleted
		}).then(() => {
			this.router.navigate(['/account']);
		})
	}

	getDisplayName(curr, prev) {
		if (curr.firstName === "" && curr.lastName === "") {
			return prev.displayName;
		} else if (curr.firstName === "") {
			return prev.firstName + " " + curr.lastName;
		} else if (curr.lastName === "") {
			return curr.firstName + " " + prev.lastName;
		} else {
			return curr.firstName + " " + curr.lastName;
		}
	}

	insertUserData(userCredential: firebase.auth.UserCredential, first: string, last: string) {
		return this.afs.doc(`users/${userCredential.user.uid}`).set({
			displayName: first + ' ' + last,
			firstName: first,
			lastName: last,
			email: this.newUser.email, 
			uid: userCredential.user.uid,
			bio: "this is the default bio",
			photoURL: "https://i.stack.imgur.com/dr5qp.jpg",
			posts: 0,
			deleted: [],
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
			if (credential.additionalUserInfo.isNewUser) {
				this.updateUserData(credential.user);
				this.router.navigate(['home']);
			} else {
				this.router.navigate(['home']);
			}
			//this.updateUserData(credential.user)
		})
	}


	private updateUserData(user) {
		// Sets user data to firestore on login

		const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
		let names = user.displayName.split(" ");
		const data: User = {
			firstName: names[0],
			lastName: names[1],
			uid: user.uid,
			email: user.email,
			displayName: user.displayName,
			photoURL: user.photoURL,
			bio: "this is the default bio",
			posts: 0,
			deleted: [],
		}

		return userRef.set(data, { merge: true })

	}


	signOut() {
		this.afAuth.auth.signOut().then(() => {
			this.router.navigate(['/']);
		});
	}

	public getUid() {
		this.afAuth.auth.currentUser.uid;
	}
}