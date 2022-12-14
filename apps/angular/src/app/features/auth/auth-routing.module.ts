import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NoAuthGuard } from '../../../core/guards/';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
    canActivate: [NoAuthGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register',
    canActivate: [NoAuthGuard],
  },
];

/** Auth routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
