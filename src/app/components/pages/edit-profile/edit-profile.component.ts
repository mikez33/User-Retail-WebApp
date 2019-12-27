import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
	selector: 'app-edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
	firstName;
	authError: any;
	constructor(public auth: AuthService) { 
		this.auth.eventAuthError$.subscribe(data => {
			this.authError = data;
		})
	}

	ngOnInit() {
	}

	updateUser(frm) {
		this.auth.update(frm.value);
	}

}
