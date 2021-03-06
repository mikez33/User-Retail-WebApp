import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent} from './components/pages/home/home.component';
import { AboutComponent} from './components/pages/about/about.component';
import { AccountComponent } from './components/pages/account/account.component';
import { SuperSecretComponent} from './super-secret/super-secret.component';
import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './components/pages/login/login.component';
import { RegistrationComponent } from './components/pages/registration/registration.component';
import { EditProfileComponent } from './components/pages/edit-profile/edit-profile.component';
import { CreatePostComponent } from './components/pages/create-post/create-post.component';
import { PostComponent } from './components/pages/post/post.component';
import { ViewProfileComponent } from './components/pages/view-profile/view-profile.component';
import { BrowseComponent } from './components/pages/browse/browse.component';


const routes: Routes = [
	{path: '', component: HomeComponent}, 
	{path: 'home', component: HomeComponent},
	{path: 'about', component: AboutComponent},
	{path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
	{path: 'account/:id', component: ViewProfileComponent, canActivate: [AuthGuard]},
	{path: 'login', component: LoginComponent},
	{path: 'register', component: RegistrationComponent},
	{path: 'secret', component: SuperSecretComponent, canActivate: [AuthGuard]},
	{path: 'edit_profile', component: EditProfileComponent, canActivate: [AuthGuard]},
	{path: 'create_post', component: CreatePostComponent, canActivate: [AuthGuard]},
	{path: 'post/:id', component: PostComponent},
	{path: 'browse', component: BrowseComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
