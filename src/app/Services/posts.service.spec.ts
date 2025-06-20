import { TestBed } from '@angular/core/testing';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PostsService } from './posts.service';
import { environment } from '../../environments/environment';
import { Post } from '../Utils/interfaces';

describe('PostsService', () => {
  let service: PostsService;
  let httpMock: HttpTestingController;

  const dummyPosts: Post[] = [
    { id: 1, title: 'Post 1', body: 'Body 1', userId: 1 },
    { id: 2, title: 'Post 2', body: 'Body 2', userId: 1 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [provideHttpClientTesting],
      providers: [PostsService],
    });
    service = TestBed.inject(PostsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch paginated posts and cache them', () => {
    service.getPaginatedPosts(1, 2).subscribe((posts: string | any[]) => {
      expect(posts.length).toBe(2);
      expect(posts).toEqual(dummyPosts);
    });

    const req = httpMock.expectOne(
      `${environment.baseUrl}/posts?_page=1&_limit=2`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyPosts);
  });

  it('should create a new post and update cache', () => {
    const newPost: Post = { id: 3, title: 'Post 3', body: 'Body 3', userId: 1 };

    service.createPost(newPost).subscribe((post: any) => {
      expect(post).toEqual(newPost);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/posts`);
    expect(req.request.method).toBe('POST');
    req.flush(newPost);
  });

  it('should update a post and update cache', () => {
    const updatedPost: Post = {
      id: 1,
      title: 'Updated Title',
      body: 'Updated Body',
      userId: 1,
    };

    service['cachedPaginatedPosts'].set('1-10', {
      data: dummyPosts,
      timestamp: Date.now(),
    });

    service.updatePost(updatedPost, 1).subscribe((post: any) => {
      expect(post).toEqual(updatedPost);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/posts/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedPost);
  });

  it('should delete a post and update cache', () => {
    service['cachedPaginatedPosts'].set('1-10', {
      data: dummyPosts,
      timestamp: Date.now(),
    });

    service.deletePost(1).subscribe((res: any) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/posts/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
