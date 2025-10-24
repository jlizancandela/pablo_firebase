# Estructura del Proyecto (Scaffolding)

Este documento describe la estructura de archivos y directorios del proyecto, explicando el propósito de cada elemento principal.

## Directorio Raíz

- **`.env`**: Archivo para definir variables de entorno. Actualmente está vacío, pero se puede usar para claves de API, configuraciones de base de datos, etc.
- **`README.md`**: Archivo de introducción al proyecto.
- **`apphosting.yaml`**: Fichero de configuración para Firebase App Hosting. Define parámetros como el número máximo de instancias del servidor.
- **`components.json`**: Fichero de configuración para la librería de componentes `shadcn/ui`. Define el estilo, la ubicación de los componentes y las rutas de alias.
- **`next.config.ts`**: Fichero de configuración principal de Next.js. Aquí se configuran las PWA, las reglas de ESLint/TypeScript y los dominios remotos para imágenes.
- **`package.json`**: Define los scripts del proyecto (como `dev`, `build`) y gestiona todas las dependencias y paquetes de Node.js.
- **`scaffolding.md`**: Este mismo archivo, dedicado a documentar la estructura del proyecto.
- **`tailwind.config.ts`**: Fichero de configuración de Tailwind CSS. Aquí se personalizan las fuentes, colores, y el tema general de la aplicación.
- **`tsconfig.json`**: Fichero de configuración de TypeScript. Define cómo el compilador de TypeScript debe tratar los archivos del proyecto.

## Directorio `docs/`

- **`backend.json`**: Un archivo crucial que define el "plano" de la estructura de datos en Firestore. Describe las entidades (`Project`, `Task`, etc.), sus propiedades y cómo se organizan en colecciones y subcolecciones.

## Directorio `public/`

Contiene archivos estáticos que se sirven públicamente.

- **`manifest.json`**: Manifiesto de la Progressive Web App (PWA). Define el nombre, los iconos, los colores y el comportamiento de la aplicación cuando se "instala" en un dispositivo.
- **`/icons/`**: Contiene los diferentes tamaños de iconos de la aplicación que se usan en la PWA para la pantalla de inicio, notificaciones, etc.

## Directorio `src/ai/`

Archivos relacionados con la funcionalidad de Inteligencia Artificial a través de Genkit.

- **`genkit.ts`**: Inicializa y configura la instancia global de Genkit, especificando los plugins a utilizar (como `googleAI`).
- **`dev.ts`**: Punto de entrada para el servidor de desarrollo de Genkit, donde se importan y registran los "flows" de IA.

## Directorio `src/app/`

El corazón de la aplicación, siguiendo la estructura del App Router de Next.js.

- **`globals.css`**: Hoja de estilos global. Define las variables de CSS para el tema de `shadcn/ui` (colores, bordes, etc.) y estilos base.
- **`layout.tsx`**: El layout principal o raíz que envuelve a toda la aplicación. Aquí se definen la estructura `<html>` y `<body>`, se importan fuentes, y se inicializan los proveedores de contexto globales como el de Firebase.
- **`page.tsx`**: La página de inicio de la aplicación, que muestra el panel principal de proyectos.

### `src/app/projects/[id]/`

Directorio para la ruta dinámica de un proyecto específico.

- **`layout.tsx`**: Layout específico para la página de un proyecto. Obtiene los datos del proyecto y los provee a través de un contexto (`ProjectProvider`) a todas las páginas anidadas.
- **`page.tsx`**: Página de "Resumen" del proyecto. Muestra los detalles generales y un resumen del progreso.
- **`phases/page.tsx`**: Página de "Fases de Obra". Muestra un acordeón con las fases y checkpoints del proyecto, permitiendo marcar su progreso.
- **`tasks/page.tsx`**: Página de "Tareas". Muestra una tabla con la lista de tareas asociadas al proyecto, permitiendo crearlas y marcarlas como completadas.
- **`photos/page.tsx`**: Página de "Galería de Fotos" del proyecto.
- **`files/page.tsx`**: Página de "Archivos" del proyecto. Muestra una tabla con los documentos adjuntos.
- **`visits/page.tsx`**: Página de "Registro de Visitas". Muestra las visitas a obra registradas.

## Directorio `src/components/`

Componentes de React reutilizables.

- **`header.tsx`**: La cabecera principal de la aplicación, presente en todas las páginas.
- **`project-card.tsx`**: Tarjeta individual que representa un proyecto en el panel principal.
- **`project-header.tsx`**: Cabecera específica para la página de un proyecto, que muestra su imagen, nombre y estadísticas.
- **`project-nav.tsx`**: Menú de navegación dentro de la página de un proyecto (Resumen, Fases, Tareas, etc.).
- **`/ui/`**: Componentes base de la librería `shadcn/ui` (Button, Card, Input, etc.), que forman el sistema de diseño de la aplicación.

## Directorio `src/firebase/`

Centraliza toda la lógica de conexión y hooks para interactuar con Firebase.

- **`config.ts`**: Contiene el objeto de configuración de Firebase (apiKey, projectId, etc.).
- **`client-provider.tsx`**: Proveedor que asegura que Firebase se inicialice una sola vez en el lado del cliente.
- **`index.ts`**: "Barrel file" que inicializa Firebase y exporta todos los hooks y utilidades importantes para que puedan ser importados desde una única ubicación.
- **`provider.tsx`**: Define el `FirebaseContext` y el proveedor principal que distribuye las instancias de Firebase (Firestore, Auth) y el estado del usuario a toda la aplicación.
- **`non-blocking-updates.tsx`**: Contiene funciones para realizar operaciones de escritura en Firestore (`setDoc`, `addDoc`, etc.) de forma no bloqueante, mejorando la respuesta de la UI.
- **`non-blocking-login.tsx`**: Funciones para iniciar sesión de forma anónima sin bloquear la UI.
- **`/firestore/`**: Contiene los hooks personalizados para interactuar con Firestore.
  - **`use-collection.tsx`**: Hook para suscribirse en tiempo real a una colección de Firestore.
  - **`use-doc.tsx`**: Hook para suscribirse en tiempo real a un único documento de Firestore.

## Directorio `src/hooks/`

Hooks de React personalizados para encapsular lógica reutilizable.

- **`use-toast.ts`**: Hook para mostrar notificaciones (toasts) en la aplicación.
- **`use-mobile.ts`**: Hook que detecta si el usuario está en un dispositivo móvil.
- **`use-file-upload.ts`**: Hook para gestionar la lógica de subida de archivos a Firebase Storage.

## Directorio `src/lib/`

Utilidades y definiciones de datos.

- **`data.ts`**: Define las interfaces de TypeScript para las principales estructuras de datos de la aplicación (`Project`, `Phase`, `Task`, etc.). También contiene la función `getInitialPhases` que genera la estructura de fases por defecto para un nuevo proyecto.
- **`utils.ts`**: Utilidades generales, como la función `cn` para combinar clases de Tailwind CSS de forma segura.
- **`placeholder-images.json` y `placeholder-images.ts`**: Gestionan una lista de imágenes de marcador de posición para los proyectos y galerías.
