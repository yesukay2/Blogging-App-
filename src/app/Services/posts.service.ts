import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  retry,
  tap,
  throwError,
} from 'rxjs';
import { CachedPost, Post } from '../Utils/interfaces';
import { Comment } from '../Utils/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts$ = new BehaviorSubject<Post[]>([]);
  private comments$ = new BehaviorSubject<Comment[]>([]);
  public posts = this.posts$.asObservable();
  public comments = this.comments$.asObservable();

  private cachedPaginatedPosts = new Map<
    string,
    { data: Post[]; timestamp: number }
  >();
  private cachedPost = new Map<string, CachedPost>();
  private cacheComments = new Map<
    string,
    { data: Comment[]; timestamp: number }
  >();

  private cachePostComments = new Map<
    string,
    { data: Comment[]; timestamp: number }
  >();
  private cacheDuration = 1000 * 60 * 5;

  baseUrl = 'https://jsonplaceholder.typicode.com';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService
  ) {}

  getPost(id: number): Observable<Post> {
    const post = this.cachedPost.get(id.toString());
    if (post && Date.now() - post.timestamp < this.cacheDuration) {
      return of(post);
    }
    return this.http.get<Post>(`${this.baseUrl}/posts/${id}`).pipe(
      tap((post) => {
        this.cachedPost.set(id.toString(), {
          ...post,
          timestamp: Date.now(),
        });
      }),
      retry(3),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return throwError(() => error);
      })
    );
  }

  getPaginatedPosts(page: number, limit: number) {
    const params = {
      _page: page.toString(),
      _limit: limit.toString(),
    };
    const cachedPosts = this.cachedPaginatedPosts.get(`${page}-${limit}`);
    if (
      cachedPosts &&
      Date.now() - cachedPosts.timestamp < this.cacheDuration
    ) {
      return of(cachedPosts.data);
    } else {
      return this.http.get<Post[]>(`${this.baseUrl}/posts`, { params }).pipe(
        tap((posts) => {
          this.cachedPaginatedPosts.set(`${page}-${limit}`, {
            data: posts,
            timestamp: Date.now(),
          });
        }),
        retry(3),
        catchError((error) => {
          this.errorHandler.handleError(error);
          return throwError(() => error);
        })
      );
    }
  }
  getComments(): Observable<Comment[]> {
    const cacheComments = this.cacheComments.get('comments');
    if (
      cacheComments &&
      Date.now() - cacheComments.timestamp < this.cacheDuration
    ) {
      return of(cacheComments.data);
    }
    return this.http.get<Comment[]>(`${this.baseUrl}/comments`).pipe(
      tap((comments) => {
        this.cacheComments.set('comments', {
          data: comments,
          timestamp: Date.now(),
        });
      }),
      retry(3),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return throwError(() => error);
      })
    );
  }

  getPostComments(id: number): Observable<Comment[]> {
    const postComments = this.cachePostComments.get(id.toString());
    if (
      postComments &&
      Date.now() - postComments.timestamp < this.cacheDuration
    ) {
      return of(postComments.data);
    }
    return this.http
      .get<Comment[]>(`${this.baseUrl}/posts/${id}/comments`)
      .pipe(
        tap((comments) => {
          this.cachePostComments.set(id.toString(), {
            data: comments,
            timestamp: Date.now(),
          });
        }),
        retry(3),
        catchError((error) => {
          this.errorHandler.handleError(error);
          return throwError(() => error);
        })
      );
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`${this.baseUrl}/posts`, post).pipe(
      retry(3),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return throwError(() => error);
      })
    );
  }

  updatePost(post: Post, id: number): Observable<Post> {
    return this.http.put<Post>(`${this.baseUrl}/posts/${id}`, post).pipe(
      retry(3),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return throwError(() => error);
      })
    );
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/posts/${id}`).pipe(
      retry(3),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return throwError(() => error);
      })
    );
  }

  clearCache() {
    this.cachedPaginatedPosts.clear();
    this.cacheComments.clear();
    this.cachedPost.clear();
    this.cachePostComments.clear();
  }
}
