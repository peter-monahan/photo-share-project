import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from 'src/app/_modal';
import { SinglePost } from 'src/app/_models/single-post';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css']
})
export class PostCardComponent implements OnInit {
  @Input() post: SinglePost | undefined;
  constructor(public modalService: ModalService) { }

  ngOnInit(): void {
  }

  showPost(id: string) {
    this.modalService.open(id);
  }

  hidePost(id: string) {
    this.modalService.close(id);
  }
}
