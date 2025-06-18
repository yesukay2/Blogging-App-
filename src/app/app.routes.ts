import { Routes } from '@angular/router';
import { LoginPageComponent } from './Pages/login-page/login-page.component';
import { RegisterPageComponent } from './Pages/register-page/register-page.component';
import { PostsPageComponent } from './Pages/posts-page/posts-page.component';
import { PostDetailsPageComponent } from './Pages/post-details-page/post-details-page.component';
import { NewPostPageComponent } from './Pages/new-post-page/new-post-page.component';
import { EditPostPageComponent } from './Pages/edit-post-page/edit-post-page.component';
import { authGuard } from './Guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'posts', component: PostsPageComponent },
  {
    path: 'posts/new-post',
    component: NewPostPageComponent,
    canActivate: [authGuard],
  },
  { path: 'posts/:id', component: PostDetailsPageComponent },
  {
    path: 'posts/edit-post/:id',
    component: EditPostPageComponent,
    canActivate: [authGuard],
  },
  { path: 'register', component: RegisterPageComponent },
];
