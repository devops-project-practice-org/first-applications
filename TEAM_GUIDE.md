# Team Setup Guide - PropertyHub

Quick setup guide for team members to run PropertyHub locally.

## ⚡ Quick Start (5 minutes)

### Option 1: Automated Setup (Recommended)

**For Windows:**
```bash
setup.bat
```

**For macOS/Linux:**
```bash
./setup.sh
```

### Option 2: Manual Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment:**
   Create `.env` file:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/propertyhub"
   JWT_SECRET="your-secure-secret-key"
   NODE_ENV="development"
   ```

3. **Setup database:**
   ```bash
   npm run db:push
   ```

4. **Start the app:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   http://localhost:5000

## 🗄️ Database Options

### Option A: Cloud Database (Easiest)
1. Go to [neon.tech](https://neon.tech) and create free account
2. Create new project
3. Copy connection string to `DATABASE_URL` in `.env`
4. Run `npm run db:push`

### Option B: Local PostgreSQL
1. Install PostgreSQL on your machine
2. Create database: `CREATE DATABASE propertyhub;`
3. Update `.env` with your local database URL
4. Run `npm run db:push`

## 🎯 Key Features to Demo

### Pakistani Market Features
- **Language Toggle**: Switch between English/Urdu (top right corner)
- **Chatbot**: Click chat icon, ask about Pakistani cities
- **WhatsApp Integration**: View any property, click WhatsApp button
- **Rent Analyzer**: Bottom right bubble on homepage
- **Near Me Filter**: Use location button in property search

### Core Features
- **Property Search**: Filter by city, price, type, bedrooms
- **Property Details**: Click any property to see full details + location
- **User Registration**: Sign up as user/agent
- **Save Properties**: Heart icon on property cards (requires login)
- **Contact Agents**: Submit inquiries on property detail pages

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# View database with Drizzle Studio
npm run db:studio

# Push schema changes to database
npm run db:push

# Build for production
npm run build
```

## 🔍 Troubleshooting

**Port 5000 already in use:**
```bash
# Kill process and restart
lsof -ti:5000 | xargs kill -9
npm run dev
```

**Database connection error:**
- Check if PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Try cloud database (neon.tech) instead

**Dependencies issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📱 Demo Flow for Team

1. **Start with Homepage** - Show featured properties
2. **Toggle Language** - Switch to Urdu, show localization
3. **Use Chatbot** - Ask "Tell me about Lahore properties"
4. **Search Properties** - Filter by Lahore, 3 bedrooms
5. **View Property Detail** - Click property, show location integration
6. **WhatsApp Integration** - Click WhatsApp button
7. **Try Rent Analyzer** - Use the rent analysis tool
8. **User Registration** - Show sign-up process
9. **Save Properties** - Demonstrate saved properties feature

## 📞 Support

- Check main README.md for detailed documentation
- All Pakistani market features are fully functional
- Google Maps integration works without API keys
- Database comes with sample properties for Lahore, Karachi, Islamabad

**Built specifically for the Pakistani real estate market** 🇵🇰