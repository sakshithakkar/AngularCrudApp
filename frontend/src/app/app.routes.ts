import { Routes } from '@angular/router';
import { UsersComponent } from './components/users/users';
import { CategoriesComponent } from './components/categories/categories';
import { ProductsComponent } from './components/products/products';
import { LoginComponent } from './components/login/login';
import { SignupComponent } from './components/signup/signup';

export const routes: Routes = [
{ path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'users', component: UsersComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'products', component: ProductsComponent },
//   { path: '', redirectTo: '/users', pathMatch: 'full' }
];

