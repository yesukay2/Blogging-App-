import { Component } from '@angular/core';
import { PostsService } from '../../Services/posts.service';
import { Post } from '../../Utils/interfaces';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService } from '../../Services/error-handler.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-posts-page',
  imports: [PostCardComponent, CommonModule, PaginationComponent],
  templateUrl: './posts-page.component.html',
  styleUrl: './posts-page.component.scss',
})
export class PostsPageComponent {
  posts: Post[] = [];
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private postsService: PostsService,
    private errorHandler: ErrorHandlerService
  ) {
    this.fetchPosts(this.currentPage);
  }

  fetchPosts(page: number) {
    this.currentPage = page;
    this.postsService.getPaginatedPosts(page, this.itemsPerPage).subscribe({
      next: (posts) => (this.posts = posts),
      error: (error) => this.errorHandler.handleError(error),
    });
  }
}
