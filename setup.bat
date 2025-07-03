@echo off
REM PropertyHub Local Setup Script for Windows
REM This script helps set up the application quickly for local development

echo 🏠 PropertyHub - Local Setup Script (Windows)
echo =============================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js (v18+) first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not available. Please install npm.
    pause
    exit /b 1
)

echo ✅ npm version:
npm --version

REM Install dependencies
echo.
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Check if .env file exists
if not exist .env (
    echo.
    echo ⚙️  Creating environment configuration...
    (
        echo # Database Configuration
        echo DATABASE_URL="postgresql://postgres:password@localhost:5432/propertyhub"
        echo.
        echo # JWT Secret ^(change this in production^)
        echo JWT_SECRET="your-super-secure-jwt-secret-key-change-this-in-production"
        echo.
        echo # Node Environment
        echo NODE_ENV="development"
        echo.
        echo # Optional: Google Maps API Key
        echo # VITE_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
    ) > .env
    echo ✅ Created .env file with default configuration
    echo ⚠️  Please update the DATABASE_URL in .env with your actual database credentials
) else (
    echo ✅ .env file already exists
)

REM Database information
echo.
echo 🗄️  Database setup information:
echo ✅ You can use either local PostgreSQL or cloud database
echo 💡 For local PostgreSQL:
echo    1. Install PostgreSQL from https://www.postgresql.org/download/windows/
echo    2. Start PostgreSQL service
echo    3. Create database: CREATE DATABASE propertyhub;
echo    4. Update DATABASE_URL in .env file
echo.
echo 💡 For cloud database (recommended):
echo    Get free database at: https://neon.tech

echo.
echo 🚀 Setup complete! Next steps:
echo.
echo 1. Configure your database:
echo    - For local PostgreSQL: Update DATABASE_URL in .env
echo    - For cloud database: Get connection string from Neon/Supabase
echo.
echo 2. Push database schema:
echo    npm run db:push
echo.
echo 3. Start the application:
echo    npm run dev
echo.
echo 4. Open in browser:
echo    http://localhost:5000
echo.
echo 📚 For detailed instructions, see README.md
echo.
echo Happy coding! 🎉
pause