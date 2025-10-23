#!/bin/sh

# Docker entrypoint script for Loan Management System
# This script handles initialization and starts the application

set -e

echo "🚀 Starting Loan Management System..."
echo "Environment: ${NODE_ENV:-development}"
echo "Port: ${PORT:-5000}"

# Function to wait for MongoDB
wait_for_mongo() {
    if [ -n "$MONGODB_URI" ]; then
        echo "⏳ Waiting for MongoDB connection..."
        
        # Extract host and port from MongoDB URI
        MONGO_HOST=$(echo $MONGODB_URI | sed -n 's/.*@\([^:]*\):.*/\1/p')
        MONGO_PORT=$(echo $MONGODB_URI | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
        
        if [ -z "$MONGO_HOST" ] || [ -z "$MONGO_PORT" ]; then
            echo "⚠️  Could not parse MongoDB URI, skipping connection check"
            return
        fi
        
        # Simple TCP connection check
        timeout=30
        while [ $timeout -gt 0 ]; do
            if nc -z "$MONGO_HOST" "$MONGO_PORT" 2>/dev/null; then
                echo "✅ MongoDB is ready!"
                return
            fi
            echo "⏳ Waiting for MongoDB ($timeout seconds remaining)..."
            sleep 2
            timeout=$((timeout-2))
        done
        
        echo "❌ MongoDB connection timeout. Proceeding anyway..."
    else
        echo "ℹ️  No MongoDB URI provided, using SQLite"
    fi
}

# Function to run database migrations
run_migrations() {
    if [ -n "$MONGODB_URI" ]; then
        echo "🔄 Running database migrations..."
        if node backend/scripts/migrate.js; then
            echo "✅ Database migrations completed"
        else
            echo "⚠️  Database migrations failed, continuing..."
        fi
    fi
}

# Function to create required directories
setup_directories() {
    echo "📁 Setting up directories..."
    mkdir -p logs database exports uploads temp
    echo "✅ Directories created"
}

# Function to validate environment
validate_environment() {
    echo "🔍 Validating environment..."
    
    if [ "$NODE_ENV" = "production" ]; then
        if [ -z "$JWT_SECRET" ]; then
            echo "❌ JWT_SECRET is required in production"
            exit 1
        fi
        
        if [ -z "$MONGODB_URI" ] && [ -z "$SQLITE_PATH" ]; then
            echo "❌ Either MONGODB_URI or SQLITE_PATH must be set in production"
            exit 1
        fi
    fi
    
    echo "✅ Environment validation passed"
}

# Function to start the application
start_application() {
    echo "🚀 Starting application server..."
    
    # Determine which server to start
    if [ -n "$MONGODB_URI" ]; then
        echo "📊 Using MongoDB database"
        exec node backend/server-mongodb.js
    else
        echo "📊 Using SQLite database"
        exec node backend/server.js
    fi
}

# Function to handle shutdown
cleanup() {
    echo "🔄 Shutting down gracefully..."
    # Kill any background processes
    kill $(jobs -p) 2>/dev/null || true
    exit 0
}

# Set up signal handlers
trap cleanup SIGTERM SIGINT

# Main execution flow
main() {
    validate_environment
    setup_directories
    wait_for_mongo
    run_migrations
    start_application
}

# Check if we're being asked to run a specific command
if [ $# -gt 0 ]; then
    case "$1" in
        "bash"|"sh"|"/bin/bash"|"/bin/sh")
            echo "🛠️  Starting shell..."
            exec "$@"
            ;;
        "node")
            echo "🟢 Running Node.js command: $*"
            exec "$@"
            ;;
        "npm")
            echo "📦 Running npm command: $*"
            exec "$@"
            ;;
        "health-check")
            echo "🏥 Running health check..."
            exec node backend/health-check.js
            ;;
        *)
            echo "🚀 Running custom command: $*"
            exec "$@"
            ;;
    esac
else
    # Run the main application
    main
fi