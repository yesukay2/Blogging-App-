import { Component, Input } from '@angular/core';
import { Post } from '../../Utils/interfaces';

@Component({
  selector: 'app-post-card',
  imports: [],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
})
export class PostCardComponent {
  @Input() post?: Post;

  constructor() {}
}
