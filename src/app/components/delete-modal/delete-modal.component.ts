import { CommonModule, Location } from '@angular/common';
import { Component, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../../Services/posts.service';

@Component({
  selector: 'app-delete-modal',
  imports: [CommonModule],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss',
})
export class DeleteModalComponent {
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private postsService: PostsService
  ) {}

  close() {
    this.location.back();
  }

  deletePost() {
    const postId = this.route.snapshot.paramMap.get('id');
    this.postsService.deletePost(parseInt(postId!)).subscribe({
      next: () => {},
      error: () => {},
    });
    this.close();
  }
}
