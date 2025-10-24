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
 *   messagingSenderId: string,
 *   storageBucket: string
 * }}
 */
export const firebaseConfig = {
    "projectId": "studio-4856973197-91469",
    "appId": "1:517159420673:web:43d9982017c1bb4140d100",
    "apiKey": "AIzaSyB6BiBi_KjH3_NGRAqrjWF-3NQdnillSk4",
    "authDomain": "studio-4856973197-91469.firebaseapp.com",
    "measurementId": "",
    "messagingSenderId": "517159420673",
    "storageBucket": "studio-4856973197-91469.appspot.com"
};
