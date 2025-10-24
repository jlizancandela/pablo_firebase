# === Etapa 1: Dependencias ===
# Instala las dependencias necesarias para construir la aplicación
FROM node:20-slim AS deps
WORKDIR /app

# Copia los archivos de definición de dependencias
COPY package.json package-lock.json* ./

# Instala las dependencias de producción
RUN npm install --omit=dev


# === Etapa 2: Builder ===
# Construye la aplicación Next.js
FROM node:20-slim AS builder
WORKDIR /app

# Copia las dependencias de la etapa anterior
COPY --from=deps /app/node_modules ./node_modules
# Copia el resto del código fuente
COPY . .

# Construye la aplicación
RUN npm run build


# === Etapa 3: Runner ===
# Configura la imagen final de producción
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copia la salida 'standalone' de la etapa de construcción
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
