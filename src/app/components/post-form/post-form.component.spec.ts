import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostFormComponent } from './post-form.component';
import { PostsService } from '../../Services/posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { Post } from '../../Utils/interfaces';

describe('PostFormComponent', () => {
  let component: PostFormComponent;
  let fixture: ComponentFixture<PostFormComponent>;
  let mockPostsService: jasmine.SpyObj<PostsService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackbar: jasmine.SpyObj<MatSnackBar>;
  let mockSanitizer: jasmine.SpyObj<DomSanitizer>;

  const fakePost: Post = {
    id: 1,
    title: 'Clean Title',
    body: 'Clean Body',
    userId: 1,
  };

  beforeEach(async () => {
    mockPostsService = jasmine.createSpyObj('PostsService', [
      'getPost',
      'createPost',
      'updatePost',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSnackbar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockSanitizer = jasmine.createSpyObj('DomSanitizer', ['sanitize']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [PostFormComponent],
      providers: [
        { provide: PostsService, useValue: mockPostsService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackbar },
        { provide: DomSanitizer, useValue: mockSanitizer },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null, // simulate create mode
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit form if invalid', () => {
    spyOn(component, 'sanitize');
    component.createPost();
    expect(component.sanitize).not.toHaveBeenCalled();
  });

  it('should call createPost on service if form is valid in create mode', () => {
    mockSanitizer.sanitize.and.callFake((_ctx, val) => val as string);

    const post: Post = { title: 'Test', body: 'Body', userId: 1, id: 999 };
    component.postForm.setValue({ title: post.title, body: post.body });

    mockPostsService.createPost.and.returnValue(of(post));

    component.createPost();

    expect(mockPostsService.createPost).toHaveBeenCalled();
    expect(mockSnackbar.open).toHaveBeenCalledWith(
      'Post created successfully.',
      'dismiss',
      { duration: 3000 }
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should call updatePost on service if in edit mode and form is valid', () => {
    // Simulate edit mode
    component.isEditMode = true;
    component.paramsId = 1;
    component.postForm.setValue({ title: 'Edited Title', body: 'Edited Body' });

    mockSanitizer.sanitize.and.callFake((_ctx, val) => val as string);
    mockPostsService.updatePost.and.returnValue(of({ ...fakePost }));

    component.createPost();

    expect(mockPostsService.updatePost).toHaveBeenCalledWith(
      jasmine.objectContaining({
        id: 1,
        title: 'Edited Title',
        body: 'Edited Body',
      }),
      1
    );
    expect(mockSnackbar.open).toHaveBeenCalledWith(
      'Post editted successfully.',
      'dismiss',
      { duration: 3000 }
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should sanitize inputs before submission', () => {
    component.postForm.setValue({ title: 'Title <b>', body: 'Body <i>' });

    mockSanitizer.sanitize.and.returnValue('Sanitized');

    component.sanitize();

    expect(mockSanitizer.sanitize).toHaveBeenCalledTimes(2);
    expect(component.postForm.value.title).toEqual('Sanitized');
    expect(component.postForm.value.body).toEqual('Sanitized');
  });

  it('should navigate back to posts on goBack()', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should unsubscribe on destroy', () => {
    const mockSub = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component['subscriptions'] = [mockSub, mockSub];

    component.ngOnDestroy();
    expect(mockSub.unsubscribe).toHaveBeenCalledTimes(2);
  });
});
