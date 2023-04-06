import { Component, Input, OnInit } from '@angular/core';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_models/member';
import { Post } from 'src/app/_models/post';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  @Input() member: Member | undefined;
  @Input() post: Post | undefined;

  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  constructor() { }

  ngOnInit(): void {


    this.galleryOptions = [
      {
        width: "500px",
        height: "632px",
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ]

    this.galleryImages = this.getImages();
  }

  getImages() {
    if(!this.post) {
      console.log("sdfjhsdfa",this.post)
      return [];
    };
    console.log("sdfjhsdfa", this.post)
    const imageUrls = [];
    for (const photo of this.post.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url
      })
    }
    console.log(imageUrls)
    return imageUrls;
  }

}
