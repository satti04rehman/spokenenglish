#!/bin/bash

# Production startup script for EngTeach.
# This script starts the server with production settings

set -e

echo "🚀 Starting EngTeach. Production Server..."

# Check if .env file exists
if [ ! -f .env ]; then
  echo "❌ Error: .env file not found!"
  echo "Please create .env file from .env.example"
  exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Verify critical environment variables
if [ -z "$MONGODB_URI" ]; then
  echo "❌ Error: MONGODB_URI not set in .env"
  exit 1
fi

if [ -z "$JWT_SECRET" ]; then
  echo "❌ Error: JWT_SECRET not set in .env"
  exit 1
fi

# Set production mode
export NODE_ENV=production

# Install dependencies if node_modules doesn't exist
if [ ! -d "server/node_modules" ]; then
  echo "📦 Installing server dependencies..."
  npm install --prefix server
fi

if [ ! -d "client/node_modules" ]; then
  echo "📦 Installing client dependencies..."
  npm install --prefix client
fi

if [ ! -d "client/dist" ]; then
  echo "🔨 Building client..."
  npm run build --prefix client
fi

# Start the server
echo "✅ Starting server on port $PORT..."
cd server
npm start
