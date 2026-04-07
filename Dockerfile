# Build stage for client
FROM node:18-alpine as client-builder
WORKDIR /client
COPY client/package*.json ./
RUN npm install --legacy-peer-deps
COPY client ./
RUN npm run build

# Runtime stage
FROM node:18-alpine
WORKDIR /app

# Copy server files
COPY server ./

# Install server dependencies (production only)
RUN npm install --legacy-peer-deps --only=production

# Copy built client from builder stage to public folder
COPY --from=client-builder /client/dist ./public

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start server
CMD ["npm", "start"]
