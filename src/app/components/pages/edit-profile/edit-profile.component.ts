import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
// import { Imgur } from'../../../../../node_modules/ng-imgur';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabase, AngularFireList, AngularFireDatabaseModule } from '@angular/fire/database';

@Component({
	selector: 'app-edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
	selectedFile: File = null;
	url
	storageRef;
	user;
	firstName;
	authError: any;
	constructor(public auth: AuthService, 
				private storage: AngularFireStorage, 
				private http: HttpClientModule) { 
		this.auth.eventAuthError$.subscribe(data => {
			this.authError = data;
		});
		this.user = auth.user;	
	}

	ngOnInit() {
	}

	onFileSelected(event) {
		this.selectedFile = <File>event.target.files[0];
	}

	uploadProfile(uid: string) {
		this.storageRef = this.storage.ref("profile: " + uid);
		let profilePhoto = this.storageRef.child("profile-photo");
		profilePhoto.put(this.selectedFile);
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
