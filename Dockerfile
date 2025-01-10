

# Stage 1: Building the admin
FROM node:20-alpine AS builder-chatty

# Add build dependencies
RUN apk add --no-cache libc6-compat

WORKDIR /app/chatty

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy source with proper .dockerignore
COPY . .

# Set production environment for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV NEXT_BUILD_TIME=true

ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID



RUN npm run prisma:generate

# Build application with error handling
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS runner-chatty

WORKDIR /app

# Add runtime dependencies
RUN apk add --no-cache libc6-compat

# Set production environment
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000

# Copy only necessary files
COPY --from=builder-chatty /app/admin/public ./public
COPY --from=builder-chatty /app/admin/.next/standalone ./
COPY --from=builder-chatty /app/admin/.next/static ./.next/static

EXPOSE 3000

# Use standalone server
CMD ["node", "server.js"]