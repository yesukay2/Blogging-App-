import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PostsService } from '../../Services/posts.service';
import { Post } from '../../Utils/interfaces';
import {
  profaneValidator,
  specialCharValidator,
} from '../../Utils/custom_validators';
import { Sanitizer, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.scss',
})
export class PostFormComponent {
  constructor(
    private postsService: PostsService,
    private sanitizer: Sanitizer
  ) {}

  postForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      profaneValidator(),
      specialCharValidator(),
    ]),
    body: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(200),
      profaneValidator(),
      specialCharValidator(),
    ]),
  });

  sanitize() {
    this.postForm
      .get('title')
      ?.setValue(
        this.sanitizer.sanitize(
          SecurityContext.HTML,
          this.postForm.value.title!
        )
      );
    this.postForm
      .get('body')
      ?.setValue(
        this.sanitizer.sanitize(SecurityContext.HTML, this.postForm.value.body!)
      );
  }
  createPost() {
    if (this.postForm.valid) {
      this.sanitize();
      this.postsService
        .createPost(this.postForm.value as Post)
        .subscribe(() => {
          this.postForm.reset();
        });
    }
  }
}
