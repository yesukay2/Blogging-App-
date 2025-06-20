import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostDetailsPageComponent } from './post-details-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../../Services/posts.service';
import { of } from 'rxjs';
import { Post, Comment } from '../../Utils/interfaces';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PostDetailsPageComponent', () => {
  let component: PostDetailsPageComponent;
  let fixture: ComponentFixture<PostDetailsPageComponent>;
  let mockPostsService: jasmine.SpyObj<PostsService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockPost: Post = {
    id: 1,
    title: 'Mock Post',
    body: 'Post body',
    userId: 1,
  };

  const mockComments: Comment[] = [
    {
      postId: 1,
      id: 1,
      name: 'Commenter',
      email: 'test@example.com',
      body: 'Nice post!',
    },
  ];

  beforeEach(async () => {
    mockPostsService = jasmine.createSpyObj('PostsService', [
      'getPost',
      'getPostComments',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [PostDetailsPageComponent],
      providers: [
        { provide: PostsService, useValue: mockPostsService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1', // param id
              },
            },
          },
        },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA], // ignore child components like CommentCardComponent
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetailsPageComponent);
    component = fixture.componentInstance;

    mockPostsService.getPost.and.returnValue(of(mockPost));
    mockPostsService.getPostComments.and.returnValue(of(mockComments));

    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch post and comments on init', () => {
    expect(mockPostsService.getPost).toHaveBeenCalledWith(1);
    expect(mockPostsService.getPostComments).toHaveBeenCalledWith(1);
    expect(component.post).toEqual(mockPost);
    expect(component.comments).toEqual(mockComments);
  });

  it('should navigate to delete post page', () => {
    component.deletePost(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['posts/1/delete-post']);
  });

  it('should navigate to edit post page', () => {
    component.editPost(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['posts/edit-post', 1]);
  });

  it('should navigate back to posts list', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['posts']);
  });

  it('should unsubscribe on destroy', () => {
    const mockSub = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component.subscription = [mockSub, mockSub];

    component.ngOnDestroy();
    expect(mockSub.unsubscribe).toHaveBeenCalledTimes(2);
  });
});
