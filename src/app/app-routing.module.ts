import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent} from './components/pages/home/home.component';
import { AboutComponent} from './components/pages/about/about.component';
import { AccountComponent } from './components/pages/account/account.component';
import { SuperSecretComponent} from './super-secret/super-secret.component';
import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './components/pages/login/login.component';
import { RegistrationComponent } from './components/pages/registration/registration.component';


const routes: Routes = [
	{path: '', component: HomeComponent}, 
	{path: 'home', component: HomeComponent},
	{path: 'about', component: AboutComponent},
	{path: 'account', component: AccountComponent},
	{path: 'login', component: LoginComponent},
	{path: 'register', component: RegistrationComponent},
	{path: 'secret', component: SuperSecretComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
