import { Component, OnInit } from '@angular/core';
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
import { SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-post-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.scss',
})
export class PostFormComponent implements OnInit {
  isEditMode = false;
  paramsId: number | null = null;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const paramsId = this.route.snapshot.paramMap.get('id');

    if (paramsId) {
      this.isEditMode = true;
      this.paramsId = +paramsId;
      this.postsService.getPost(this.paramsId).subscribe((post) => {
        this.postForm.get('title')?.setValue(post.title);
        this.postForm.get('body')?.setValue(post.body);
      });
    }
  }

  postForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(200),
      profaneValidator(),
      specialCharValidator(),
    ]),
    body: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(1000),
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
      const post: Post = this.postForm.value as Post;

      if (this.isEditMode && this.paramsId) {
        console.log(this.paramsId);
        this.postsService
          .updatePost(
            {
              ...post,
              id: this.paramsId,
            },
            this.paramsId
          )
          .subscribe(() => {
            this.postForm.reset();
            this.router.navigate(['/posts']);
          });
        return;
      } else {
        this.postsService
          .createPost(this.postForm.value as Post)
          .subscribe(() => {
            this.postForm.reset();
          });
      }
    }
    return;
  }

  goBack() {
    this.router.navigate(['/posts']);
  }
}
