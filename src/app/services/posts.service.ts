import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StoreService } from '../store/store.service';
import {HOST} from "../app.config";

@Injectable({
  providedIn: 'root',
})
export class PostsService {

  constructor(
    private httpClient: HttpClient,
    private storeService: StoreService
  ) {}

  public getPosts(): Observable<Post[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storeService.authToken()}`,
    });
    return this.httpClient.get<Post[]>(HOST + '/api/posts', {
      headers,
    });
  }

  addPost(post: Post): Observable<Post> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storeService.authToken()}`,
    });
    return this.httpClient.post<Post>(HOST + '/api/post', post, {
      headers,
    });
  }

  public serchPosts(filter: string): Observable<Post[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storeService.authToken()}`,
    });
    return this.httpClient.get<Post[]>(
      HOST + '/api/posts/search?query=' + filter,
      { headers }
    );
  }

  deletePost(post: Post): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storeService.authToken()}`,
    });
    return this.httpClient.delete<void>(
      HOST + '/api/post/delete?id=' + post.id,
      { headers }
    );
  }

  updatePost(post: any): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storeService.authToken()}`,
    });
    return this.httpClient.put<void>(HOST + '/api/post', post, {
      headers,
    });
  }
}
