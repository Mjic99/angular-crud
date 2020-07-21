import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import Post from '../models/Post';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl: string = 'https://jsonplaceholder.typicode.com'

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  }

  constructor(private http: HttpClient) { }

  getPosts() {
    return this.http.get(`${this.baseUrl}/posts?_start=5&_limit=10`)
  }

  getUsers() {
    return this.http.get(`${this.baseUrl}/users`)
  }

  addPost(post: Post): Observable<Post> {
    return this.http.post<any>(`${this.baseUrl}/posts`, post, this.httpOptions)
  }

  deletePost(id: number): Observable<Post> {
    return this.http.delete<Post>(`${this.baseUrl}/posts/${id}`)
  }

  editPost(post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.baseUrl}/posts/${post.id}`, post, this.httpOptions)
  }
}
