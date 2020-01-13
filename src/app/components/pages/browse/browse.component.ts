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
	following?: string[];
	followers?: string[];
}

@Component({
	selector: 'app-browse',
	templateUrl: './browse.component.html',
	styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {
	finalList = [];
	updateTimeList = []; // list of times when posts were last updated
	uidPostList = [];
	map; // maps an update time to the download URL
	following;
	currUid;
	currPosts;
	currMeta;
	currTime;
	currURL;
	constructor(
		public auth: AuthService, 
    	private afAuth: AngularFireAuth,
    	private afs: AngularFirestore,
    	public router: Router,
    	public storage: AngularFireStorage,
    ) { }

	ngOnInit() {
		this.map = new Map([]);
		this.afs.doc<User>(`users/${this.afAuth.auth.currentUser.uid}`).valueChanges()
		.subscribe(user => {
			this.following = user.following;
			let index = 0;
			for (let i = 0; i < this.following.length; i++) {
				this.currUid = this.following[i];
				let path = "profiles/" + this.currUid + "/posts/post";
				this.afs.doc<User>(`users/${this.currUid}`).valueChanges()
				.subscribe(user => {
					this.currPosts = user.posts;
					for (let j = 1; j <= this.currPosts; j++) {
						if (!this.arrayContains(user.deleted, j.toString())) {
							this.currMeta = this.storage.ref(path + j.toString() + "/1")
							.getMetadata().subscribe(metadata => {
								this.currURL = this.storage.ref(path + j.toString() + "/1")
								.getDownloadURL();
								this.updateTimeList[index] = {
									url: this.currURL,
									meta: metadata.updated,
								};
								let tempIndex = index;
								for (let k = index - 1; k >= 0; k--) {
									let currTime = this.updateTimeList[k];
									if (currTime.meta < metadata.updated) {
										let tempURL = currTime.url;
										let tempMeta = currTime.meta;
										this.updateTimeList[k] = {
											url : this.currURL,
											meta : metadata.updated,
										}
										this.updateTimeList[tempIndex] = {
											url : tempURL,
											meta : tempMeta,
										}
										tempIndex = k;
									}
								}
								index++;
							});
						} 
					}
				});
			}
		});
	}

	sortByTime(arr) {
		let res = [];
		for (let i = 0; i < arr.length; i++) {
			let max = arr[i].meta;
			let url = arr[i].url;
			for (let j = i + 1; j < arr.length; j++) {
				if (arr[j].meta > max) {
					max = arr[j].meta;
					url = arr[j].url;
				}
			}
			res.push({
				url : url,
				max : max,
			});
		}
		return res;
	}

	arrayContains(arr, i) {
    for (let index = 0; index <= arr.length; index++) {
      if (arr[index] === i) {
        return true;
      }
    }
    return false;
  }

}
