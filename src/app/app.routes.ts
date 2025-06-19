import { Routes } from '@angular/router';
import { LoginPageComponent } from './Pages/login-page/login-page.component';
import { RegisterPageComponent } from './Pages/register-page/register-page.component';
import { PostsPageComponent } from './Pages/posts-page/posts-page.component';
import { PostDetailsPageComponent } from './Pages/post-details-page/post-details-page.component';
import { NewPostPageComponent } from './Pages/new-post-page/new-post-page.component';
import { authGuard } from './Guards/auth.guard';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';

export const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'posts', component: PostsPageComponent },
  {
    path: 'posts/new-post',
    component: NewPostPageComponent,
    canActivate: [authGuard],
  },
  { path: 'posts/:id', component: PostDetailsPageComponent },
  { path: 'posts/:id/delete', component: DeleteModalComponent },
  {
    path: 'posts/edit-post/:id',
    component: NewPostPageComponent,
    canActivate: [authGuard],
  },
  { path: 'register', component: RegisterPageComponent },
];
