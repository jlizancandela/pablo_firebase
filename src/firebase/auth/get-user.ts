
import { Auth, User } from 'firebase/auth';

let user: User | null = null;
let auth: Auth | null;

/**
 * Obtiene el usuario actualmente autenticado desde la instancia de Auth.
 * @returns {User | null} El objeto del usuario si está autenticado, o null si no lo está.
 */
export function getUser() {
  if (auth) {
    return auth.currentUser;
  }
}
