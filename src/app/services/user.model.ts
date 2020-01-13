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
	deleted?: string[];
	following?: string[];
	followers?: string[];
}