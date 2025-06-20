import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostCardComponent } from './post-card.component';
import { Router } from '@angular/router';
import { Post } from '../../Utils/interfaces';

describe('PostCardComponent', () => {
  let component: PostCardComponent;
  let fixture: ComponentFixture<PostCardComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockPost: Post = {
    id: 1,
    title: 'Test Title',
    body: 'Test Body',
    userId: 123,
  };

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [PostCardComponent],
      providers: [{ provide: Router, useValue: mockRouter }],
    }).compileComponents();

    fixture = TestBed.createComponent(PostCardComponent);
    component = fixture.componentInstance;
    component.post = mockPost; // Set input
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to post detail on viewPost()', () => {
    component.viewPost(mockPost.id);
    expect(mockRouter.navigate).toHaveBeenCalledWith([`posts/`, mockPost.id]);
  });

  it('should navigate to edit page on editPost()', () => {
    component.editPost(mockPost.id);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      `posts/edit-post/`,
      mockPost.id,
    ]);
  });

  it('should navigate to delete confirmation on deletePost()', () => {
    component.deletePost(mockPost.id);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      `posts/${mockPost.id}/delete`,
    ]);
  });
});
