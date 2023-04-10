import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;

  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();
  fullUser: Member | undefined;

  constructor(private http: HttpClient) { }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + "account/register", model).pipe(
      map(user => {
        if(user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

  login(model: any) {
    return this.http.post<User>(this.baseUrl + "account/login", model).pipe(
        map((response: User) => {
            const user = response;
            if(user) {
              this.setCurrentUser(user);
            }
        })
    )
  }

  logout() {
    localStorage.removeItem("user")
    this.currentUserSource.next(null);
  }

  setCurrentUser(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  getFullUser() {
    return this.http.get<Member>(this.baseUrl + "users/current").pipe(
      map(user => {
        if(user) {
          this.fullUser = user;
        }
      })
    )
  }
}
