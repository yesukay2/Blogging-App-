import { Component, Input } from '@angular/core';
import { Post } from '../../Utils/interfaces';
import { Router } from '@angular/router';
import { PostsService } from '../../Services/posts.service';

@Component({
  selector: 'app-post-card',
  imports: [],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
})
export class PostCardComponent {
  @Input() post?: Post;

  constructor(private router: Router, private postService: PostsService) {}

  viewPost(id: number) {
    this.router.navigate([`posts/`, id]);
  }
  editPost(id: number) {
    this.router.navigate([`posts/edit-post/`, id]);
  }

  deletePost(id: number) {
    this.router.navigate([`posts/${id}/delete`]);
  }
}
