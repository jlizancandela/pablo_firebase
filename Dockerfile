# ==== STAGE 1: Build ====
# Utiliza una imagen oficial de Node.js con la versión 20 y Alpine para la etapa de construcción.
FROM node:20-alpine AS build

# Establece el directorio de trabajo dentro del contenedor.
WORKDIR /app

# Copia los archivos de definición de dependencias.
COPY package.json ./

# Instala las dependencias del proyecto.
# Usamos 'npm install' que generará un package-lock.json si no existe.
RUN npm install

# Copia el resto del código de la aplicación.
COPY . .

# Construye la aplicación para producción.
# Las variables de entorno se pasan como argumentos en el comando 'docker build'.
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID
ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=$NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

RUN npm run build

# ==== STAGE 2: Production ====
# Utiliza una imagen más ligera para la etapa de producción.
FROM node:20-alpine AS production

# Establece el directorio de trabajo.
WORKDIR /app

# Copia solo los artefactos de construcción necesarios de la etapa anterior.
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/public ./public

# Expone el puerto 3000 (puerto por defecto de Next.js).
EXPOSE 3000

# El comando para iniciar la aplicación en modo producción.
CMD ["npm", "start"]
