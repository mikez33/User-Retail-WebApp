import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
// import { Imgur } from'../../../../../node_modules/ng-imgur';

@Component({
	selector: 'app-edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
	user;
	firstName;
	authError: any;
	constructor(public auth: AuthService) { 
		this.auth.eventAuthError$.subscribe(data => {
			this.authError = data;
		});
		this.user = auth.user;
	}

	ngOnInit() {
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
