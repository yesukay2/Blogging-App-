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

import { environment } from '../../environments/environment';

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

  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService
  ) {
    this.loadCacheFromLocalStorage();
  }

  getPost(id: number): Observable<Post> {
    const post = this.cachedPost.get(id.toString());
    if (post && Date.now() - post.timestamp < this.cacheDuration) {
      return of(post);
    }
    return this.http.get<Post>(`${this.baseUrl}/posts/${id}`).pipe(
      tap((post) => {
        this.posts$.next([post]);
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

  getPaginatedPosts(page: number, limit: number): Observable<Post[]> {
    const key = `${page}-${limit}`;
    const cached = this.cachedPaginatedPosts.get(key);

    // Always emit from cache immediately if exists
    if (cached) {
      this.posts$.next(cached.data);

      // Refresh cache if stale
      if (Date.now() - cached.timestamp < this.cacheDuration) {
        return of(cached.data);
      }
    }

    // Otherwise fetch and update
    const params = {
      _page: page.toString(),
      _limit: limit.toString(),
    };

    return this.http.get<Post[]>(`${this.baseUrl}/posts`, { params }).pipe(
      tap((posts) => {
        this.cachedPaginatedPosts.set(key, {
          data: posts,
          timestamp: Date.now(),
        });
        this.saveCacheToLocalStorage();
        this.posts$.next(posts);
      }),

      retry(3),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return throwError(() => error);
      })
    );
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
    // Simulate ID if not present
    if (!post.id) post.id = Date.now();

    const key = '1-10';
    const cached = this.cachedPaginatedPosts.get(key);
    const newPageData = cached ? [post, ...cached.data].slice(0, 10) : [post];

    this.cachedPaginatedPosts.set(key, {
      data: newPageData,
      timestamp: Date.now(),
    });
    this.saveCacheToLocalStorage();
    this.posts$.next(newPageData);

    return this.http.post<Post>(`${this.baseUrl}/posts`, post).pipe(
      retry(3),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return throwError(() => error);
      })
    );
  }

  updatePost(post: Post, id: number): Observable<Post> {
    this.cachedPaginatedPosts.forEach((value, key) => {
      const updatedPage = value.data.map((_post) =>
        _post.id === id ? post : _post
      );
      this.cachedPaginatedPosts.set(key, {
        data: updatedPage,
        timestamp: Date.now(),
      });

      // Also update the observable if this page is visible
      if (
        JSON.stringify(this.posts$.getValue()) === JSON.stringify(value.data)
      ) {
        this.posts$.next(updatedPage);
      }
    });

    return this.http.put<Post>(`${this.baseUrl}/posts/${id}`, post).pipe(
      retry(3),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return throwError(() => error);
      })
    );
  }

  deletePost(id: number): Observable<any> {
    this.cachedPaginatedPosts.forEach((value, key) => {
      const updatedPage = value.data.filter((post) => post.id !== id);
      this.cachedPaginatedPosts.set(key, {
        data: updatedPage,
        timestamp: Date.now(),
      });
      console.log('deleted', id);
      console.log('updatedPage', updatedPage);

      if (
        JSON.stringify(this.posts$.getValue()) === JSON.stringify(value.data)
      ) {
        this.posts$.next(updatedPage);
      }
    });

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

  private saveCacheToLocalStorage(): void {
    const serialized = Array.from(this.cachedPaginatedPosts.entries());
    localStorage.setItem('cachedPosts', JSON.stringify(serialized));
  }

  private loadCacheFromLocalStorage(): void {
    const data = localStorage.getItem('cachedPosts');
    if (data) {
      try {
        const parsed: [string, { data: Post[]; timestamp: number }][] =
          JSON.parse(data);
        this.cachedPaginatedPosts = new Map(parsed);
      } catch (e) {
        console.error('Failed to load cached posts from localStorage', e);
      }
    }
  }
}
