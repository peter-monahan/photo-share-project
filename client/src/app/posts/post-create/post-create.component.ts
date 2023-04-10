import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { PostsService } from 'src/app/_services/posts.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  @ViewChild("createForm") createForm: NgForm | undefined;
  @HostListener("window:beforeunload", ["$event"]) unloadNotification($event:any) {
    if (this.createForm?.dirty) {
      $event.returnValue = true;
    }
  }
  model: any = {
    photos: [],
  };
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  user: User | undefined;

  constructor(private router: Router, public accountService: AccountService, private postService: PostsService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if(user) this.user = user;
      }
    })
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  createPost() {
    this.postService.CreatePost(this.model).subscribe({
      next: () => this.router.navigateByUrl(`/users/${this.user?.username}`),
      error: err => console.error(err)
    });
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + "users/photos",
      authToken: "Bearer " + this.user?.token,
      isHTML5: true,
      allowedFileType: ["image"],
      removeAfterUpload: true,
      autoUpload: true,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, respose, status, headers) => {
      if (respose) {
        const photo = JSON.parse(respose);
        this.model.photos.push(photo);
      }
    }
  }
}
