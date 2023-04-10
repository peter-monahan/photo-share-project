import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/_models/member';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  member: Member | undefined;
  following = false;
  disableButtons = false;
  constructor(private memberService: MembersService, private route: ActivatedRoute, public accountService: AccountService) { }

  ngOnInit(): void {
    this.loadMember();

  }

  loadMember() {
    const username = this.route.snapshot.paramMap.get("username");
    if(!username) return;
    this.memberService.getMember(username).subscribe({
      next: member => {
        this.member = member;
        member.posts.reverse();
        this.loadFollowing()
      }
    });
  }

  loadFollowing() {
    this.accountService.getFullUser().subscribe({
      next: () => {
        if(this.accountService.fullUser?.isFollowing.some((user: any) => user?.id == this.member?.id)) this.following = true;
        console.log(this.accountService.fullUser?.isFollowing, this.accountService.fullUser?.isFollowing.some((user: any) => user?.id == this.member?.id));
      }
    })
  }

  followUser() {
    if(!this.member) return;
    this.disableButtons = true;

    this.memberService.followMember(this.member?.id).subscribe({
      next: () => {
        this.following = true;
        this.disableButtons = false;
      },
      error: (err) => {
        console.error(err)
        this.disableButtons = false;
      }
    })
  }

  unfollowUser() {
    if(!this.member) return;
    this.disableButtons = true;

    console.log(this.accountService.fullUser?.isFollowing);
    console.log(this.following)
    this.memberService.unfollowMember(this.member?.id).subscribe({
      next: () => {
        this.following = false;
        this.disableButtons = false;
      },
      error: (err) => {
        console.error(err)
        this.disableButtons = false;
      }
    })
  }
}
