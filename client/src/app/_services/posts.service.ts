import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SinglePost } from '../_models/single-post';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  baseUrl = environment.apiUrl;
  posts: SinglePost[] = [];

  constructor(private http: HttpClient) { }

  getPosts() {
    // if (this.posts.length > 0) return of(this.posts);
    return this.http.get<SinglePost[]>(this.baseUrl + "posts").pipe(
      map(posts =>{
        this.posts = posts;
        return posts;
      })
    );
  }

  getFollowedPosts() {
    // if (this.posts.length > 0) return of(this.posts);
    return this.http.get<SinglePost[]>(this.baseUrl + "posts/followed").pipe(
      map(posts =>{
        this.posts = posts;
        return posts;
      })
    );
  }

  CreatePost(model: any) {
    return this.http.post<any>(this.baseUrl + "posts", model);
  }
}
