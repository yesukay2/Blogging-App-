import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  Observable,
  retry,
  throwError,
} from 'rxjs';
import { Post } from '../Utils/interfaces';
import { Comment } from '../Utils/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts$ = new BehaviorSubject<Post[]>([]);
  private comments$ = new BehaviorSubject<Comment[]>([]);
  public posts = this.posts$.asObservable();
  public comments = this.comments$.asObservable();

  baseUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/posts`).pipe(
      retry(3),
      catchError((error) => {
        throwError(() => error);
        return [];
      })
    );
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/posts/${id}`).pipe(
      retry(3),
      catchError((error) => {
        throwError(() => error);
        return [];
      })
    );
  }
  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/comments`).pipe(
      retry(3),
      catchError((error) => {
        throwError(() => error);
        return [];
      })
    );
  }

  getPostComments(id: number): Observable<Comment[]> {
    return this.http
      .get<Comment[]>(`${this.baseUrl}/posts/${id}/comments`)
      .pipe(
        retry(3),
        catchError((error) => {
          throwError(() => error);
          return [];
        })
      );
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`${this.baseUrl}/posts/${post.id}`, post).pipe(
      retry(3),
      catchError((error) => {
        throwError(() => error);
        return [];
      })
    );
  }

  deletePost(id: number): void {
    this.http.delete(`${this.baseUrl}/posts/${id}`).pipe(
      retry(3),
      catchError((error) => {
        throwError(() => error);
        return [];
      })
    );
  }
}
