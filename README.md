# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Solución a problemas de CORS en Firebase Storage

Si tienes problemas para subir archivos (por ejemplo, la subida se queda "atascada" o ves errores de CORS en la consola del navegador), es probable que necesites configurar las políticas de CORS (Cross-Origin Resource Sharing) en tu bucket de Google Cloud Storage.

Sigue estos pasos en la terminal de tu entorno de desarrollo para solucionarlo:

1.  **Identifica tu bucket de almacenamiento**: Tu bucket de Firebase Storage tiene un nombre que generalmente sigue el formato `[ID-DEL-PROYECTO-DE-FIREBASE].appspot.com`. Puedes encontrarlo en la sección de "Storage" de tu [consola de Firebase](https://console.firebase.google.com/).

2.  **Aplica la configuración CORS**: Ejecuta el siguiente comando en tu terminal, reemplazando `[TU_BUCKET_DE_STORAGE]` con el nombre de tu bucket. El archivo `cors.json` ya está incluido en este proyecto.

    ```sh
    gcloud storage buckets update gs://[TU_BUCKET_DE_STORAGE] --cors-file=./cors.json
    ```

    **Ejemplo:** Si tu bucket se llama `constructwise-app.appspot.com`, el comando sería:

    ```sh
    gcloud storage buckets update gs://constructwise-app.appspot.com --cors-file=./cors.json
    ```

3.  **Verifica la configuración (opcional)**: Puedes comprobar que la configuración se ha aplicado correctamente con el siguiente comando:

    ```sh
    gcloud storage buckets describe gs://[TU_BUCKET_DE_STORAGE] --format="json(cors)"
    ```

Después de ejecutar estos pasos, la subida de archivos debería funcionar correctamente.
