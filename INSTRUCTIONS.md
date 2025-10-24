# Instrucciones de Configuración y Ejecución

Este documento proporciona las instrucciones necesarias para configurar y ejecutar la aplicación ConstructWise, tanto en un entorno de desarrollo local como utilizando Docker.

## 1. Prerrequisitos

Asegúrate de tener instalados los siguientes programas en tu sistema:

- **Node.js** (versión 20.x o superior)
- **npm** (normalmente se instala con Node.js)
- **Docker** (si planeas ejecutar la aplicación en un contenedor)

## 2. Configuración de Secretos de Firebase

La aplicación necesita conectarse a un proyecto de Firebase. Para ello, utiliza variables de entorno que debes configurar.

### a. Obtén tus credenciales de Firebase

1.  Ve a la [consola de Firebase](https://console.firebase.google.com/).
2.  Crea un nuevo proyecto o selecciona uno existente.
3.  Dentro de tu proyecto, ve a la sección de **Configuración del proyecto** (el icono de engranaje).
4.  En la pestaña **General**, desplázate hacia abajo hasta la sección "Tus apps".
5.  Selecciona una aplicación web existente o registra una nueva.
6.  Al seleccionar la aplicación, verás un objeto de configuración (`firebaseConfig`). Copia los valores de las siguientes claves.

### b. Crea tu archivo `.env`

En la raíz del proyecto, encontrarás un archivo llamado `.env`. Este archivo sirve como plantilla. Debes copiar los valores que obtuviste de la consola de Firebase en las siguientes variables:

```bash
# Credenciales del proyecto de Firebase
# Copia los valores desde la configuración de tu aplicación web en la consola de Firebase

NEXT_PUBLIC_FIREBASE_PROJECT_ID="TU_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="TU_APP_ID"
NEXT_PUBLIC_FIREBASE_API_KEY="TU_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="TU_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="TU_MEASUREMENT_ID"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="TU_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="TU_STORAGE_BUCKET"
```

**Importante:** El archivo `.env` contiene información sensible y **no debe ser subido a repositorios públicos**.

## 3. Ejecución en Modo Desarrollo

Para ejecutar la aplicación en tu máquina local con recarga en caliente:

1.  **Instala las dependencias**:
    ```sh
    npm install
    ```

2.  **Inicia el servidor de desarrollo**:
    ```sh
    npm run dev
    ```

3.  Abre tu navegador y ve a `http://localhost:9002`.

## 4. Ejecución con Docker

El `Dockerfile` incluido está optimizado para producción. Utiliza un build multi-etapa para generar una imagen ligera y segura.

1.  **Construye la imagen de Docker**:
    Desde la raíz del proyecto, ejecuta:
    ```sh
    docker build -t constructwise-app .
    ```

2.  **Ejecuta el contenedor**:
    Para iniciar un contenedor a partir de la imagen, debes pasarle las variables de entorno definidas en tu archivo `.env`.
    ```sh
    docker run --rm -p 9002:3000 --env-file ./.env constructwise-app
    ```
    - `-p 9002:3000`: Mapea el puerto `9002` de tu máquina al puerto `3000` del contenedor.
    - `--env-file ./.env`: Pasa todas las variables definidas en tu archivo `.env` al entorno del contenedor.
    - `--rm`: Elimina el contenedor automáticamente cuando se detiene.

3.  Abre tu navegador y ve a `http://localhost:9002`.
