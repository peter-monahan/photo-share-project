import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryImageSize, NgxGalleryOptions } from '@kolkov/ngx-gallery';


const GRAPH_ENDPOINT_photo = 'https://graph.microsoft.com/v1.0/me/photo/$value';
const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  users: any;
  profile!: ProfileType;
  display = false;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.galleryOptions = [
      {
        width: '100%',
        height: "795px",
        imagePercent: 100,
        // thumbnailsColumns: 4,
        thumbnails: false,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
        imageSize: NgxGalleryImageSize.Contain,
        imageArrowsAutoHide: true,
        imageAutoPlay: true,
        imageAutoPlayInterval: 4000,
        imageAutoPlayPauseOnHover: true,
        imageInfinityMove: true,
      },
      {
        breakpoint: 1399,
        width: '100%',
        height: '685px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20,
      },
      {
        breakpoint: 1199,
        width: '100%',
        height: '575px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      {
        breakpoint: 991,
        width: '100%',
        height: '1025px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20,

      },
      {
        breakpoint: 767,
        width: '100%',
        height: '750px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20,

      },
      {
        breakpoint: 575,
        width: '100%',
        height: '140vw',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20,

      },
    ]

    this.galleryImages = this.getImages();
  }

  getImages() {
    const returnUrls = [];
    const imageUrls = ["./assets/seed-images/seed57.jpg", "./assets/seed-images/seed38.JPG", "./assets/seed-images/seed59.jpg", "./assets/seed-images/seed30.jpeg", "./assets/seed-images/seed67.jpg", "./assets/seed-images/seed45.JPG", ];
    for (const url of imageUrls) {
      returnUrls.push({
        small: url,
        medium: url,
        big: url
      })
    }
    return returnUrls;
  }


  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  cancelRegister(event: boolean) {
    this.registerMode = event;
  }

  getProfile() {
    this.http.get(GRAPH_ENDPOINT)
      .subscribe(profile => {
        this.profile = profile;
      });
      this.display = true;
  }
}
