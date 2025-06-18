import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PostsService } from '../../Services/posts.service';
import { Post } from '../../Utils/interfaces';

@Component({
  selector: 'app-post-form',
  imports: [ReactiveFormsModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.scss',
})
export class PostFormComponent {
  constructor(private postsService: PostsService) {}

  postForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    body: new FormControl('', [Validators.required]),
  });

  createPost() {
    if (this.postForm.valid) {
      this.postsService
        .createPost(this.postForm.value as Post)
        .subscribe(() => {
          this.postForm.reset();
        });
    }
  }
}
