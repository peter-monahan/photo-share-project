import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  showDropdown = false;
  constructor(public accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
  }

  click() {
    const func = () => {
      if(this.showDropdown) this.showDropdown = false;
      document.removeEventListener("click", func)
    }
    return func
  }

  login() {
    this.accountService.login(this.model).subscribe({
        next: () => this.router.navigateByUrl("/users")
    })
  }


  logout() {
    this.accountService.logout();
    this.router.navigateByUrl("/");
  }

  toggleDropDown($event: MouseEvent) {
    if(!this.showDropdown) {
      $event.stopImmediatePropagation()
      this.showDropdown = true;
      document.addEventListener("click", this.click())
    }
  }
}
