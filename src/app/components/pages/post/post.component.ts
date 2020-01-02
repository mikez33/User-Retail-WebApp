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
	constructor(private afs: AngularFirestore, 
				private route: ActivatedRoute,
				private auth: AuthService,
				private afAuth: AngularFireAuth,
				private storage: AngularFireStorage,
	) { }

	ngOnInit() {
		this.postID = this.route.snapshot.paramMap.get('id');
		this.uid = this.postID.split('-')[0];
		this.postID = this.postID.split('-')[1];
		this.postReference = this.afs.doc(`posts/${this.uid}/posts/${this.postID}`);
		this.postReference.valueChanges().subscribe(post => {
			this.productName = post.productName;
			this.price = post.price;
			this.description = post.description;
			this.likes = post.likes;
			const path = "profiles/" + this.uid + "/posts/post" + this.postID + "/";
			this.mainURL = this.postURL = this.storage.ref(path + "1").getDownloadURL();
			this.count = post.photos;
			let index= 0;
			for (let i = 2; i <= this.count; i++) {
				this.postURL = this.storage.ref(path + i.toString()).getDownloadURL();
				this.postList[index] = this.postURL;
				index++;
			}
		})
	}

}
