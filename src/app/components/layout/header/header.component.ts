import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	user: firebase.User;
	uid;
	accountLink;

	constructor(public auth: AuthService, 
				public router: Router,
				public afs: AngularFirestore,
				public afAuth: AngularFireAuth,) {}

	ngOnInit() {
		// this.auth.getUserState().subscribe(
		// 	user => {
		// 		this.user = user;
		// 	}
		// );
		//this.uid = this.afAuth.auth.currentUser.uid;
		//this.accountLink = "/account" + this.uid;
	}

	login() {
		this.router.navigate(['/login']);
	}
	
	register() {
		this.router.navigate(['register']);
	}

	goToAccount(uid) {
		return ('account/' + uid);
	}
}
