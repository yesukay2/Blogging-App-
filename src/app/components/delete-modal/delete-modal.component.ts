import { CommonModule, Location } from '@angular/common';
import { Component, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../../Services/posts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorHandlerService } from '../../Services/error-handler.service';

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
    private postsService: PostsService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService
  ) {}

  close() {
    this.location.back();
  }

  deletePost() {
    const postId = this.route.snapshot.paramMap.get('id');
    this.postsService.deletePost(parseInt(postId!)).subscribe({
      next: () => {
        this.snackBar.open('Post deleted successfully', 'Close');
      },
      error: (error) => {
        this.errorHandler.handleError(error);
      },
    });
    this.close();
  }
}
