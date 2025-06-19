import { Component } from '@angular/core';
import { PostFormComponent } from '../../components/post-form/post-form.component';

@Component({
  selector: 'app-new-post-page',
  imports: [PostFormComponent],
  templateUrl: './new-post-page.component.html',
  styleUrl: './new-post-page.component.scss',
})
export class NewPostPageComponent {}
