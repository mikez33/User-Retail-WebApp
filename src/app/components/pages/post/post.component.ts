import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';

import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap} from 'rxjs/operators';
import * as firebase from 'firebase';

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

@Component({
	selector: 'app-post',
	templateUrl: './post.component.html',
	styleUrls: ['./post.component.css']
})

export class PostComponent implements OnInit {
	userPost;
	count;
	uid;
	post;
	postReference;
	posts: number;
	postID: string;
	postURL;
	postList = [];
	mainURL;
	productName;
	price;
	description;
	likes;
	isAuthenticated;
	displayName;
	accountLink;
	constructor(private afs: AngularFirestore, 
				private route: ActivatedRoute,
				private auth: AuthService,
				private afAuth: AngularFireAuth,
				private storage: AngularFireStorage,
				private router: Router,
	) { 
		this.afs.doc<User>(`users/${this.uid}`).valueChanges().subscribe(user => {
			this.displayName = user.displayName;
		});
	}

	ngOnInit() {
		this.postID = this.route.snapshot.paramMap.get('id');
		this.uid = this.postID.split('-')[0];
		this.accountLink = "/account/" + this.uid;
		this.postID = this.postID.split('-')[1];
		this.postReference = this.afs.doc(`posts/${this.uid}/posts/${this.postID}`);
		this.postReference.valueChanges().subscribe(post => {
			this.afs.doc<User>(`users/${this.uid}`).valueChanges().subscribe(user => {
				this.displayName = user.displayName;
			});
			this.productName = post.productName;
			this.price = post.price;
			this.description = post.description;
			this.likes = post.likes;
			this.displayName = post.displayName;
			const path = "profiles/" + this.uid + "/posts/post" + this.postID + "/";
			this.mainURL = this.postURL = this.storage.ref(path + "1").getDownloadURL();
			this.count = post.photos;
			let index = 0;
			for (let i = 2; i <= this.count; i++) {
				this.postURL = this.storage.ref(path + i.toString()).getDownloadURL();
				this.postList[index] = this.postURL;
				index++;
			}
		});
		this.auth.user.subscribe(user => {
			this.isAuthenticated = (user.uid === this.uid);
		});
	}

	delete(user) {
		const path = "profiles/" + this.uid + "/posts/post" + this.postID + "/";
		this.postReference = this.afs.doc(`posts/${this.uid}/posts/${this.postID}`);
		this.postReference.valueChanges().subscribe(post => {
			this.count = post.photos;
			for (let i = 1; i <= this.count; i++) {
				this.postURL = this.storage.ref(path + i.toString()).delete();
			}
		});
		let arr = user.deleted;
		arr.push(this.postID);
		this.afs.doc(`users/${this.uid}`).set({
			firstName: user.firstName,
			lastName: user.lastName,
			displayName: user.displayName,
			email: user.email,
			uid: user.uid,
			bio: user.bio,
			posts: user.posts,
			deleted: arr,
		});
		window.alert("Post Successfully Deleted");
		this.router.navigate(['/account']);
	}

	goToAccount() {
		this.router.navigate(['/account/' + this.uid]);
	}

}
