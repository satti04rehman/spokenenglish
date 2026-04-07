FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install server dependencies
WORKDIR /app/server
RUN npm ci

# Install client dependencies and build
WORKDIR /app/client
RUN npm ci && npm run build

# Copy application files
WORKDIR /app
COPY server ./server
COPY client ./client

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start server
WORKDIR /app/server
CMD ["npm", "start"]
