import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList} from '@angular/fire/database';

import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from './user.model';
import { map } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	user$: Observable<any[]>;
	data;
	newUser: any;
	private eventAuthError = new BehaviorSubject<string>("");
	eventAuthError$= this.eventAuthError.asObservable();
	constructor(
		private afAuth: AngularFireAuth,
		private afs: AngularFirestore,
		private router: Router,
		private db : AngularFirestore,
	) {
		this.data = new Object();
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

				this.insertUserData(userCredential)
					.then(() => {
						this.router.navigate(['/home'])
					});
			})
			.catch(error => {
				this.eventAuthError.next(error);
			});
	}

	insertUserData(userCredential: firebase.auth.UserCredential) {
		this.data = {
			displayName: this.newUser.firstName + ' ' + this.newUser.lastName,
			email: this.newUser.email, 
			firstName: this.newUser.firstName,
			lastName: this.newUser.lastName,
			bio: "this is the default bio",
			photoURL: "https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwi2xvXZ9M7mAhUSTN8KHelECjAQjRx6BAgBEAQ&url=https%3A%2F%2Fwww.sackettwaconia.com%2Fdefault-profile%2F&psig=AOvVaw1qcVpy9IYMUOpFJVIvZblj&ust=1577298413497072",
		};
		return this.db.doc(`Users/${userCredential.user.uid}`).set({
			email: this.newUser.email, 
			firstName: this.newUser.firstName,
			lastName: this.newUser.lastName,
			bio: "this is the default bio",
			photoURL: "https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwi2xvXZ9M7mAhUSTN8KHelECjAQjRx6BAgBEAQ&url=https%3A%2F%2Fwww.sackettwaconia.com%2Fdefault-profile%2F&psig=AOvVaw1qcVpy9IYMUOpFJVIvZblj&ust=1577298413497072",
		});
	}

	getData() {
		return this.data;
	}

	login(email: string, password: string) {
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

	logout() {
		return this.afAuth.auth.signOut();
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
		// const user = auth.GoogleAuthProvider().cre;
		// const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${User.bio}`);
		// let user: User = {
  //  			uid: User.uid, 
		// 	email: User.email,
		// 	displayName: User.displayName,
		// 	photoURL: User.photoURL,
		// 	bio: User.bio
		// } 
		// return user.bio
	}
}

