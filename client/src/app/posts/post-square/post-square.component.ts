import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from 'src/app/_modal';
import { Member } from 'src/app/_models/member';
import { Post } from 'src/app/_models/post';

@Component({
  selector: 'app-post-square',
  templateUrl: './post-square.component.html',
  styleUrls: ['./post-square.component.css']
})
export class PostSquareComponent implements OnInit {
  @Input() member: Member | undefined;
  @Input() post: Post | undefined;

  // showPost = false;

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
  }

  showPost(id: string) {
    this.modalService.open(id);
  }

  hidePost(id: string) {
    this.modalService.close(id);
  }
}
