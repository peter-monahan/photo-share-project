import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = "Photo share";


  constructor(private accountService: AccountService, private router: Router) {

  }
  ngOnInit(): void {

    this.setCurrentUser();
  }


  setCurrentUser() {
    const userString = localStorage.getItem("user");
    if(!userString) {
      const localKeys = Object.keys(localStorage);
      let idTokenKey;
      for(let i = 0; i < localKeys.length; i++) {
        if(localKeys[i].indexOf("net-accesstoken") > -1) {
          idTokenKey = localKeys[i];
          break;
        }
      }
      if(idTokenKey) {
        const token = JSON.parse(localStorage[idTokenKey])["secret"];
        if(token) {
          // let info = this.authService.instance.getAllAccounts()[0];
          this.accountService.MsLogin(token).subscribe({
            next: () => this.router.navigateByUrl("/feed")
        })
        }
      }
      return;
    }
    const user: User = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }

}
