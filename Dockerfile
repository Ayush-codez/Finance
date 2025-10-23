# Multi-stage Dockerfile for Loan Management System
# This builds both frontend and backend optimally for production

# Stage 1: Build shared package
FROM node:18-alpine AS shared-builder
WORKDIR /app
COPY package*.json ./
COPY shared/package*.json ./shared/
RUN npm ci --only=production --workspace=shared
COPY shared/ ./shared/
RUN npm run build --workspace=shared

# Stage 2: Build backend
FROM node:18-alpine AS backend-builder
WORKDIR /app

# Copy shared build
COPY --from=shared-builder /app/shared/ ./shared/

# Install backend dependencies
COPY package*.json ./
COPY backend/package*.json ./backend/
RUN npm ci --only=production --workspace=backend

# Copy backend source and build
COPY backend/ ./backend/
RUN npm run build --workspace=backend

# Stage 3: Build frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app

# Copy shared build
COPY --from=shared-builder /app/shared/ ./shared/

# Install frontend dependencies
COPY package*.json ./
COPY frontend/package*.json ./frontend/
RUN npm ci --workspace=frontend

# Copy frontend source
COPY frontend/ ./frontend/

# Build frontend
ENV NODE_ENV=production
ENV REACT_APP_API_URL=/api
RUN npm run build --workspace=frontend

# Stage 4: Production runtime
FROM node:18-alpine AS production
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeapp -u 1001

# Copy shared package
COPY --from=shared-builder --chown=nodeapp:nodejs /app/shared/ ./shared/

# Copy backend production files
COPY --from=backend-builder --chown=nodeapp:nodejs /app/backend/dist/ ./backend/
COPY --from=backend-builder --chown=nodeapp:nodejs /app/backend/package*.json ./backend/
COPY --from=backend-builder --chown=nodeapp:nodejs /app/node_modules/ ./node_modules/

# Copy frontend build
COPY --from=frontend-builder --chown=nodeapp:nodejs /app/frontend/build/ ./frontend/build/

# Copy production configuration
COPY --chown=nodeapp:nodejs docker-entrypoint.sh ./
COPY --chown=nodeapp:nodejs package*.json ./

# Make entrypoint executable
RUN chmod +x docker-entrypoint.sh

# Create necessary directories
RUN mkdir -p logs database exports && \
    chown -R nodeapp:nodejs logs database exports

# Install production dependencies
RUN npm ci --only=production && npm cache clean --force

# Switch to non-root user
USER nodeapp

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node backend/health-check.js

# Expose ports
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV HOST=0.0.0.0

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["./docker-entrypoint.sh"]