import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { InteractionType } from '@azure/msal-browser';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  @ViewChild("editForm") editForm: NgForm | undefined;
  @HostListener("window:beforeunload", ["$event"]) unloadNotification($event:any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }

  model: any = {
    photos: [],
  };
  uploader: FileUploader | undefined;
  showUploader = false;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;

  member: Member | undefined;
  user: User | null = null;

  constructor(
    private accountService: AccountService,
    private membersService: MembersService,
    private router: Router,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })


  }

  ngOnInit(): void {
    this.loadMember();
    this.initializeUploader();
    this.loadPhotos();
    console.log(this.model);
  }

  loadMember() {
    if(!this.user) return;
    this.membersService.getMember(this.user.username).subscribe({
      next: member => this.member = member
    })
  }

  loadPhotos() {
    this.membersService.getMemberPhotos().subscribe({
      next: photos => this.model.photos = photos
    });
  }

  saveEdit() {
    this.membersService.updateMember(this.editForm?.value).subscribe({
      next: () => {
        console.log(this.member);
        alert("Profile successfully updated.");
        this.editForm?.reset(this.member);
      }
    })

  }

  deleteUser() {
    if(confirm("Are you sure you want to delete your account?")) {
      this.membersService.deleteMember().subscribe({
        next: () => {
          alert("Profile successfully deleted.");
          this.logout()
        }
      })
    }
  }

  logout() {
    this.accountService.logout();
    if(this.authService.instance.getAllAccounts().length > 0) this.msLogout();
    this.router.navigateByUrl("/");
  }

  msLogout() {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      this.authService.logoutPopup({
        postLogoutRedirectUri: "/",
        mainWindowRedirectUri: "/"
      });
    } else {
      this.authService.logoutRedirect({
        postLogoutRedirectUri: "/",
      });
    }
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + "users/profile-photo",
      authToken: "Bearer " + this.user?.token,
      isHTML5: true,
      allowedFileType: ["image"],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
      queueLimit: 2
    });

    this.uploader.onWhenAddingFileFailed = (item, filter, options) => {
      alert("File must be an image under 10MB");
      console.log("Hi");
    }

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      if(this.uploader && this.uploader.queue.length > 1) {
        this.uploader?.removeFromQueue(this.uploader.queue[0]);
      }
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
     
      this.showUploader = false;
    }
  }

  toggleShowUploader() {
    this.showUploader = !this.showUploader;
  }
}
