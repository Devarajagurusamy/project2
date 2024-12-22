export interface User {
  id?: string;  // MongoDB generates an `_id` field
  name: string;
  email: string;
  password: string;
}
