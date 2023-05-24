import { Component, Inject, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionType, PopupRequest, AuthenticationResult, RedirectRequest, InteractionStatus } from '@azure/msal-browser';
import { Subject, filter, take, takeUntil } from 'rxjs';
import { User } from '../_models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  private readonly _destroying$ = new Subject<void>();
  isIframe = false;


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

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.checkAuth();
      });

  }


  login() {
    this.accountService.login(this.model).subscribe({
        next: () => this.router.navigateByUrl("/feed")
    })
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

  checkAuth() {
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
}
