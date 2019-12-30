import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
// import { Imgur } from'../../../../../node_modules/ng-imgur';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabase, AngularFireList, AngularFireDatabaseModule } from '@angular/fire/database';

@Component({
	selector: 'app-edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
	selectedFile: File = null;
	uid;
	authError: any;
	profileSrc;
	constructor(public auth: AuthService, 
				private storage: AngularFireStorage, 
				private http: HttpClientModule,
				private afAuth: AngularFireAuth) { 
		this.auth.eventAuthError$.subscribe(data => {
			this.authError = data;
		});
		this.uid = this.afAuth.auth.currentUser.uid;	
		this.profileSrc = this.storage.ref("profiles/" + this.uid + "/profile-photo")
        .getDownloadURL();
	}

	ngOnInit() {
	}

	onFileSelected(event) {
		this.selectedFile = <File>event.target.files[0];
	}

	uploadProfile(uid: string) {
		const filePath = "profiles/" + uid + "/profile-photo";
		this.uid = uid;
		//this.storageRef = this.storage.ref(filePath);
		//let profilePhoto = this.storageRef.child("profile-photo");
		const task = this.storage.upload(filePath, this.selectedFile);
		//this.profileSrc = this.storage.ref(filePath).getDownloadURL();
		window.alert("Successful Upload!");
	}

	updateUser(frm, user) {
		// let url = this.controller.upload(frm.value.photoURL).then(function then(model) {
		// 	return model.link
		// });
		this.auth.update(frm.value, user);
	}

	processFile(imageInput : File) {
		let data;
		let reader = new FileReader();
		reader.readAsDataURL(imageInput);
		reader.onloadend = function() {
			data = reader.result;
		}
		return data;
	}

}
