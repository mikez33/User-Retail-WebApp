import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	user: firebase.User;

	constructor(public auth: AuthService, public router: Router) {}

	ngOnInit() {
		// this.auth.getUserState().subscribe(
		// 	user => {
		// 		this.user = user;
		// 	}
		// );
	}

	login() {
		this.router.navigate(['/login']);
	}
	register() {
		this.router.navigate(['register']);
	}
}
