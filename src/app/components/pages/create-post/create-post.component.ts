import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';

@Component({
	selector: 'app-create-post',
	templateUrl: './create-post.component.html',
	styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
	selectedFile1: File = null;
	selectedFile2: File = null;
	selectedFile3: File = null;
	selectedFile4: File = null;
	count;
	example1;
	example2;
	example3;
	example4;
	posts;
	uid;
	constructor(
		public auth: AuthService, 
    	private afAuth: AngularFireAuth,
    	private afs: AngularFirestore,
    	public router: Router,
    	public storage: AngularFireStorage,
	) { 
		//console.log(this.auth.newUser.posts);
		this.uid = this.afAuth.auth.currentUser.uid;
		this.count = 0;
		this.example1 = this.storage.ref("Examples/Clothing1.jpg").getDownloadURL();
		this.example2 = this.storage.ref("Examples/Clothing2.jpg").getDownloadURL();
		this.example3 = this.storage.ref("Examples/Clothing3.jpg").getDownloadURL();
		this.example4 = this.storage.ref("Examples/Clothing4.jpg").getDownloadURL();
	}

	ngOnInit() {
	}

	onSelectedFile1(event) {
		this.selectedFile1 = <File>event.target.files[0];
	}

	onSelectedFile2(event) {
		this.selectedFile2 = <File>event.target.files[0];
	}

	onSelectedFile3(event) {
		this.selectedFile3 = <File>event.target.files[0];
	}

	onSelectedFile4(event) {
		this.selectedFile4 = <File>event.target.files[0];
	}

	uploadPost(frm, posts) {
		if (this.selectedFile1 == null) {
			window.alert("Must Upload Main Image");
		} else {
			this.count += 1;
			const name = frm.value.name;
			const price = frm.value.price;
			const description = frm.value.description;
			let strPosts = (posts + 1).toString();
			this.afs.doc(`users/${this.uid}`).set({
				posts: posts + 1,
			});
			const initPath = "profiles/" + this.uid + "/posts/post" + strPosts + "/";
			let ref = this.storage.ref(initPath + (this.count).toString());
			ref.put(this.selectedFile1, { customMetadata: { 
				productName: name,
				price: price,
				description: description
			} });
			if (this.selectedFile2 !== null) {
				this.count += 1;
				ref = this.storage.ref(initPath + (this.count).toString());
				ref.put(this.selectedFile2);
			}
			if (this.selectedFile3 !== null) {
				this.count += 1;
				ref = this.storage.ref(initPath + (this.count).toString());
				ref.put(this.selectedFile3);
			}
			if (this.selectedFile4 !== null) {
				this.count += 1;
				ref = this.storage.ref(initPath + (this.count).toString());
				ref.put(this.selectedFile4);
			}
			this.router.navigate(['/account']);
			window.alert("Successful Post!");

		}
	}

}
