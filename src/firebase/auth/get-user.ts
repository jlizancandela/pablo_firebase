import { Auth, User } from 'firebase/auth';

let user: User | null = null;
let auth: Auth | null;

export function getUser() {
  if (auth) {
    return auth.currentUser;
  }
}
