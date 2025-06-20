import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.scss',
})
export class PostFormComponent implements OnInit, OnDestroy {
  isEditMode = false;
  paramsId: number | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const paramsId = this.route.snapshot.paramMap.get('id');

    if (paramsId) {
      this.isEditMode = true;
      this.paramsId = +paramsId;
      const subscription = this.postsService
        .getPost(this.paramsId)
        .subscribe((post) => {
          this.postForm.get('title')?.setValue(post.title);
          this.postForm.get('body')?.setValue(post.body);
        });
      this.subscriptions.push(subscription);
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
        const subscription = this.postsService
          .updatePost(
            {
              ...post,
              id: this.paramsId,
            },
            this.paramsId
          )
          .subscribe(() => {
            this.snackbar.open('Post editted successfully.', 'dismiss', {
              duration: 3000,
            });
            this.postForm.reset();
            this.router.navigate(['/posts']);
          });
        this.subscriptions.push(subscription);
        return;
      } else {
        const subscription = this.postsService
          .createPost(this.postForm.value as Post)
          .subscribe(() => {
            this.snackbar.open('Post created successfully.', 'dismiss', {
              duration: 3000,
            });
            this.postForm.reset();
            this.router.navigate(['/posts']);
          });
        this.subscriptions.push(subscription);
      }
    }
    return;
  }

  goBack() {
    this.router.navigate(['/posts']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
