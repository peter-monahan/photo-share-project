import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { Photo } from '../_models/photo';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  photos: Photo[] = [];

  constructor(private http: HttpClient) { }

  // getStaticMembers() {

  // }

  // getStaticMember() {

  // }
  getMembers() {
    // if (this.members.length > 0) return of(this.members);
    return this.http.get<Member[]>(this.baseUrl + "users").pipe(
      map(members => {
        this.members = members;
        return members;
      })
    );
  }

  getMember(username: string) {
    // const member = this.members.find(x => x.userName === username);
    // if (member) {
    //   return of(member);
    // }
    return this.http.get<Member>(this.baseUrl + "users/" + username);
  }

  getMemberPhotos() {
    return this.http.get<Photo[]>(this.baseUrl + "users/photos").pipe(
      map((photos) => {
        this.photos = photos;
        return photos
      })
    );
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + "users", member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = {...this.members[index], ...member}
      })
    )
  }

  followMember(userId: number) {
    return this.http.post(this.baseUrl + "users/follow/" + userId, {});
  }

  unfollowMember(userId: number) {
    return this.http.delete(this.baseUrl + "users/follow/" + userId, {});
  }

  deleteMember() {
    return this.http.delete(this.baseUrl + "users");
  }
}
