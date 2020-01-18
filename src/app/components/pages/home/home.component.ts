import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';


@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	jumbotron1;
	logo1;
	logo2;
	logo3;
	top1;
	top2;
	top3;
	user1;
	user2;
	user3;
	constructor(
		private storage: AngularFireStorage
		) { }

	ngOnInit() {
		this.jumbotron1 = this.storage.ref("Samples/jumbotron1.jpg").getDownloadURL();
		this.logo1 = this.storage.ref("Samples/Nike Logo.jpg").getDownloadURL();
		this.logo2 = this.storage.ref("Samples/tommy-logo.jpg").getDownloadURL();
		this.logo3 = this.storage.ref("Samples/kith-logo.jpg").getDownloadURL();
		this.top1 = this.storage.ref("/profiles/cw40zIGCEkTXTK6ry2AWJf4gtBs1/posts/post1/1").getDownloadURL();
		this.top2 = this.storage.ref("/profiles/cw40zIGCEkTXTK6ry2AWJf4gtBs1/posts/post2/1").getDownloadURL();
		this.top3 = this.storage.ref("/profiles/cw40zIGCEkTXTK6ry2AWJf4gtBs1/posts/post3/1").getDownloadURL();
	}

}
