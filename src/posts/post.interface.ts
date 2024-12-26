export interface Post {
  id?: string;  // MongoDB generates an `_id` field
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}
