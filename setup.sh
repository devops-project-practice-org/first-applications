#!/bin/bash

# PropertyHub Local Setup Script
# This script helps set up the application quickly for local development

echo "🏠 PropertyHub - Local Setup Script"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v18+) first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available. Please install npm."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check if .env file exists
if [ ! -f .env ]; then
    echo ""
    echo "⚙️  Creating environment configuration..."
    cat > .env << EOF
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/propertyhub"

# JWT Secret (change this in production)
JWT_SECRET="your-super-secure-jwt-secret-key-change-this-in-production"

# Node Environment
NODE_ENV="development"

# Optional: Google Maps API Key
# VITE_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
EOF
    echo "✅ Created .env file with default configuration"
    echo "⚠️  Please update the DATABASE_URL in .env with your actual database credentials"
else
    echo "✅ .env file already exists"
fi

# Check if PostgreSQL is running (basic check)
echo ""
echo "🗄️  Checking database connection..."

# Try to connect to PostgreSQL
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL client (psql) is available"
    echo "💡 If you haven't set up the database yet, please follow these steps:"
    echo "   1. Start PostgreSQL service"
    echo "   2. Create database: CREATE DATABASE propertyhub;"
    echo "   3. Update DATABASE_URL in .env file"
else
    echo "⚠️  PostgreSQL client not found. You can still use a cloud database like Neon."
    echo "   Get free database at: https://neon.tech"
fi

echo ""
echo "🚀 Setup complete! Next steps:"
echo ""
echo "1. Configure your database:"
echo "   - For local PostgreSQL: Update DATABASE_URL in .env"
echo "   - For cloud database: Get connection string from Neon/Supabase"
echo ""
echo "2. Push database schema:"
echo "   npm run db:push"
echo ""
echo "3. Start the application:"
echo "   npm run dev"
echo ""
echo "4. Open in browser:"
echo "   http://localhost:5000"
echo ""
echo "📚 For detailed instructions, see README.md"
echo ""
echo "Happy coding! 🎉"