import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {
  @Input() member: Member | undefined;

  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
  }

  followUser() {
    if(!this.member) return;
    this.memberService.followMember(this.member?.id).subscribe({
      next: () => console.log("success")
    })
  }
}
