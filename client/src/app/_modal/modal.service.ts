import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: any[] = [];

  constructor() { }

  add(modal: any) {
    this.modals.push(modal);
  }

  remove(id: string) {
    this.modals = this.modals.filter(modal => modal.id !== id);
  }

  open(id: string) {
    const modal = this.modals.find(x => x.id === id);
    modal.open();
  }

  close(id: string) {
    const modal = this.modals.find(x => x.id === id);
    if(modal) {
      modal.close();
    } else {
      console.error(`Modal with id of ${id} not found`);
      console.error("Modal:", modal);
      console.error("Modals", this.modals);

    }
  }
}
