import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { SinglePost } from '../_models/single-post';
import { PostsService } from '../_services/posts.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  posts: SinglePost[] = this.postService.posts;
  constructor(private postService: PostsService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  // ngOnDestroy(): void {

  // }

  loadPosts() {
    this.postService.getFollowedPosts().subscribe({
      next: posts => {
        this.posts = posts
        console.log(posts);
      }
    })
  }

  clearPosts() {
    this.posts = [];
  }
}
