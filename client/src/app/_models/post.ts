import { Photo } from "./photo";


export interface Post {
  id: number;
  photos: Photo[];
  caption: string;
  appUserId: number;
  createdAt: string;
  updatedAt: string;
}
