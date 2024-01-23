export interface User {
  id: number;
  fullName: string;
  age: number;
  email: string;
  password: string;
  posts: Post[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
export interface Post {
  id: number;
  title: string;
  content: string;
  likes: number;
  created_at: Date;
  updated_at: Date;
  deletedAt: Date;
  userId: number;
  userName: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
