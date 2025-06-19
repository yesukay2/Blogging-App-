import { Component, Input, OnInit } from '@angular/core';
import { PostsService } from '../../Services/posts.service';
import { Comment, Post } from '../../Utils/interfaces';
import { CommentCardComponent } from '../../components/comment-card/comment-card.component';

import { ActivatedRoute, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-details-page',
  imports: [CommentCardComponent, CommonModule],
  templateUrl: './post-details-page.component.html',
  styleUrl: './post-details-page.component.scss',
})
export class PostDetailsPageComponent implements OnInit {
  @Input() post?: Post;
  @Input() comments?: Comment[];
  private paramId?: string;

  constructor(private postsService: PostsService) {}

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  ngOnInit() {
    this.paramId = this.route.snapshot.paramMap.get('id')?.toString();
    if (this.paramId) {
      this.postsService.getPost(parseInt(this.paramId)).subscribe((post) => {
        this.post = post;
      });
      this.postsService
        .getPostComments(parseInt(this.paramId))
        .subscribe((comments) => (this.comments = comments));
    }
  }

  deletePost(id: number) {
    this.router.navigate([`posts/${id}/delete-post`]);
  }

  editPost(id: number) {
    this.router.navigate(['posts/edit-post', id]);
  }

  goBack() {
    this.router.navigate(['posts']);
  }
}
