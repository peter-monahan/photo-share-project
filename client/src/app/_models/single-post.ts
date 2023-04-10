import { FlatUser } from "./flat-user";
import { Photo } from "./photo";

export interface SinglePost {
  id: number;
  photos: Photo[];
  caption: string;
  appUserId: number;
  appUser: FlatUser;
  createdAt: string;
  updatedAt: string;
}
