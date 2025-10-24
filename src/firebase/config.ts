/**
 * @fileoverview Carga y exporta la configuración de Firebase desde variables de entorno.
 * Este enfoque es seguro y flexible, permitiendo diferentes configuraciones para
 * desarrollo y producción sin hardcodear secretos en el código fuente.
 */

/**
 * Objeto de configuración de Firebase.
 * Lee las variables de entorno `NEXT_PUBLIC_*` para configurar la conexión.
 * Es crucial que estas variables estén disponibles en el entorno donde se compila
 * y ejecuta la aplicación (por ejemplo, a través de un archivo .env o en el sistema de despliegue).
 * @type {{
 *   projectId: string,
 *   appId: string,
 *   apiKey: string,
 *   authDomain: string,
 *   measurementId: string,
 *   messagingSenderId: string
 * }}
 */
export const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
};
