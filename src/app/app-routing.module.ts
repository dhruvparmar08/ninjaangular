import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { MainGuard } from './services/main.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch:'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule), canActivate: [AuthGuard]},
  { path: 'main', loadChildren: () => import('./main/main.module').then(m => m.MainModule), canActivate: [MainGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
