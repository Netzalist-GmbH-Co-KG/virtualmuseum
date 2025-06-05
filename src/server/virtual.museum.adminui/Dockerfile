# Build-Stage - Hier kompilieren wir alles für Linux
FROM node:20-alpine AS builder

WORKDIR /app

# Build-Dependencies und -Tools für native Module
RUN apk add --no-cache python3 make g++ 

# Wir setzen NODE_ENV noch nicht auf production, damit devDependencies installiert werden
ENV NEXT_TELEMETRY_DISABLED=1

# Package-Dateien kopieren und ALLE Dependencies installieren (inkl. dev)  
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Quellcode kopieren und bauen
COPY . .
RUN npm run build

# Production-Stage - Nur die kompilierten Dateien 
# mit den korrekten Linux-nativen Modulen
FROM node:20-alpine AS runner

WORKDIR /app

# Umgebungsvariablen
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Ensure the target mount point for the DB file is not a directory from the build
RUN rm -rf /app/virtualmuseum.db

# Standalone-Dateien aus dem Builder kopieren
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Als Root laufen lassen für einfachen Zugriff auf Volume-Mounts
# Anmerkung: In einer perfekten Welt würden wir Berechtigungen korrekt setzen, aber die Zeit drängt

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
