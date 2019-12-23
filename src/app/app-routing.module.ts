import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent} from './components/pages/home/home.component';
import { AboutComponent} from './components/pages/about/about.component';
import { SuperSecretComponent} from './super-secret/super-secret.component';
import { AuthGuard } from './services/auth.guard';


const routes: Routes = [
	{path: '', component: HomeComponent}, 
	{path: 'about', component: AboutComponent},
	{path: 'secret', component: SuperSecretComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
