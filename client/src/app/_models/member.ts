import { Post } from "./post"

export interface Member {
  id: number
  userName: string
  displayName: string
  bio: string
  profilePicUrl: string
  publicId: any
  posts: Post[]
  isFollowing: []
  createdAt: string
  updatedAt: string
}
