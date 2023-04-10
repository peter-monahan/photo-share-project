import { Component, ElementRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalComponent implements OnInit {
  @Input() id: string | undefined;
  private _element: any;

  constructor(private modalService: ModalService, private element: ElementRef) {
    this._element = element.nativeElement;
  }

  ngOnInit(): void {
    if(!this.id) {
      console.error("Modal must have an id");
      return;
    }
    // this._element.style.display = "none";
    document.body.appendChild(this._element);
    this._element.addEventListener("click", (e: any) => {
      if(e.target.className === "app-modal") {
        this.close();
      }
    });

    this.modalService.add(this);
  }

  ngOnDestroy(): void {
    document.body.classList.remove("app-modal-open");
    if(this.id) {
      this.modalService.remove(this.id);
    }
    this._element.remove();
  }


  open(): void {
    this._element.style.display = "block";
    document.body.classList.add("app-modal-open");
  }

  close(): void {
    this._element.style.display = "none";
    document.body.classList.remove("app-modal-open");
  }
}
