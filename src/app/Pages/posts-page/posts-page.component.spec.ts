import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostsPageComponent } from './posts-page.component';
import { PostsService } from '../../Services/posts.service';
import { ErrorHandlerService } from '../../Services/error-handler.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { Post } from '../../Utils/interfaces';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PostsPageComponent', () => {
  let component: PostsPageComponent;
  let fixture: ComponentFixture<PostsPageComponent>;
  let mockPostsService: jasmine.SpyObj<PostsService>;
  let mockErrorHandler: jasmine.SpyObj<ErrorHandlerService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  const mockPosts: Post[] = [
    { id: 1, title: 'Test Post', body: 'This is a test', userId: 1 },
    { id: 2, title: 'Another Post', body: 'Another test', userId: 1 },
  ];

  beforeEach(async () => {
    mockPostsService = jasmine.createSpyObj(
      'PostsService',
      ['getPaginatedPosts'],
      {
        posts: of(mockPosts),
      }
    );
    mockErrorHandler = jasmine.createSpyObj('ErrorHandlerService', [
      'handleError',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [PostsPageComponent],
      providers: [
        { provide: PostsService, useValue: mockPostsService },
        { provide: ErrorHandlerService, useValue: mockErrorHandler },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignores child components like <app-post-card>
    }).compileComponents();

    fixture = TestBed.createComponent(PostsPageComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to posts on init and update posts', () => {
    mockPostsService.getPaginatedPosts.and.returnValue(of(mockPosts));

    component.ngOnInit();

    expect(component.posts).toEqual(mockPosts);
    expect(mockPostsService.getPaginatedPosts).toHaveBeenCalledWith(1, 10);
  });

  it('should handle error when fetching posts fails', () => {
    mockPostsService.getPaginatedPosts.and.returnValue(
      throwError(() => new Error('Fetch failed'))
    );

    component.fetchPosts(1);

    expect(mockErrorHandler.handleError).toHaveBeenCalled();
  });

  it('should navigate to new-post on addPost()', () => {
    component.addPost();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['posts/new-post']);
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const mockSub = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component.subscriptions = [mockSub, mockSub];

    component.ngOnDestroy();

    expect(mockSub.unsubscribe).toHaveBeenCalledTimes(2);
  });
});
