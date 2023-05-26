import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, filter, of, take, takeUntil } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { AuthenticationResult, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';
type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  registerMode = false;
  isIframe = false;
  loginDisplay = false;
  profile!: ProfileType;
  private readonly _destroying$ = new Subject<void>();

  model: any = {};
  showDropdown = false;
  user: User | undefined;
  constructor(
    public accountService: AccountService,
    private router: Router,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private http: HttpClient
    ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if(user) this.user = user;
      }
    })
  }

  // ngOnInit(): void {
  //   if(this.user || true) {
  //     const localKeys = Object.keys(localStorage);

  //     let idTokenKey;
  //     for(let i = 0; i < localKeys.length; i++) {
  //       if(localKeys[i].indexOf("net-idtoken") > -1) {
  //         idTokenKey = localKeys[i];
  //         break;
  //       }
  //     }
  //     if(idTokenKey) {
  //       console.log(JSON.parse(localStorage[idTokenKey])["secret"]);
  //     }
  //   }
  // }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        console.log(this.authService.instance.getTokenCache());

      });

  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    if(!this.user) {
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
          this.authMsLogin(token);
        }
      }
    }

  }

  msLogin() {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);

          });
      } else {
        this.authService.loginPopup()
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
      } else {
        this.authService.loginRedirect();
      }
    }
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

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
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
        next: () => this.router.navigateByUrl("/feed")
    })
  }

  authMsLogin(token: string) {
    this.accountService.MsLogin(token).subscribe({
        next: () => this.router.navigateByUrl("/feed")
    })
  }

  demoLogin() {
      this.model.username = "demouser";
      this.model.password = "Pa$$w0rd";
      this.login();
  }


  logout() {
    this.accountService.logout();
    if(this.authService.instance.getAllAccounts().length > 0) this.msLogout();
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
