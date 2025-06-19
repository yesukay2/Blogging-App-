// import { Component, OnInit } from '@angular/core';
// import { PostFormComponent } from '../post-form/post-form.component';
// import { PostsService } from '../../Services/posts.service';
// import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { ActivatedRoute } from '@angular/router';
// import { Post } from '../../Utils/interfaces';

// @Component({
//   selector: 'app-edit-post',
//   imports: [ReactiveFormsModule],
//   templateUrl: './edit-post.component.html',
//   styleUrl: './edit-post.component.scss',
// })
// export class EditPostComponent implements OnInit {
//   paramsId?: string;
//   constructor(
//     private postsService: PostsService,
//     private route: ActivatedRoute
//   ) {}

//   editForm = new FormGroup({
//     title: new FormControl(''),
//     body: new FormControl(''),
//   });

//   ngOnInit(): void {
//     this.paramsId = this.route.snapshot.paramMap.get('id')?.toString();

//     if (this.paramsId) {
//       this.postsService.getPost(parseInt(this.paramsId)).subscribe((post) => {
//         this.editForm.get('title')?.setValue(post.title);
//         this.editForm.get('body')?.setValue(post.body);
//       });
//     }
//   }

//   editPost() {
//     this.postsService
//       .updatePost(this.editForm.value as Post, parseInt(this.paramsId!))
//       .subscribe(() => {
//         this.editForm.reset();
//       });
//   }
// }
