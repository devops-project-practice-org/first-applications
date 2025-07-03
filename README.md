# PropertyHub - Pakistani Real Estate Platform

A comprehensive real estate platform built specifically for the Pakistani market, featuring Urdu language support, local city integration, and WhatsApp communication.

## 🚀 Features

### Core Features
- **Property Listings**: Browse, search, and filter properties across Pakistan
- **User Authentication**: Secure JWT-based authentication with role-based access
- **Property Management**: Add, edit, and manage property listings (agents/admins)
- **Saved Properties**: Save favorite properties for easy access
- **Inquiry System**: Direct communication between buyers and agents
- **Advanced Search**: Filter by location, price, type, bedrooms, and more

### Pakistani Market Localization
- **🇵🇰 Urdu Language Support**: Complete bilingual interface (English/Urdu)
- **Major Cities Integration**: Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad
- **WhatsApp Integration**: Direct agent communication via WhatsApp
- **Smart Chatbot**: AI assistant with knowledge of Pakistani cities and property types
- **Rent Analyzer**: Market analysis tool for rental properties
- **Location Services**: "Near Me" filtering with Pakistani city coordinates
- **Negotiation Tips**: Localized property negotiation guidance

### Technical Features
- **Google Maps Integration**: Property location display (works without API keys)
- **Responsive Design**: Mobile-first approach with modern UI
- **Real-time Updates**: Live property data with efficient caching
- **Role-based Access**: Guest, User, Agent, and Admin roles
- **Image Galleries**: Multiple property images support

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Wouter** for client-side routing
- **TanStack Query** for server state management
- **shadcn/ui** with Radix UI primitives
- **Tailwind CSS** for styling
- **React Hook Form** with Zod validation

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** database
- **Drizzle ORM** for type-safe database operations
- **JWT Authentication** with bcrypt
- **Express Sessions** for session management

### Database
- **PostgreSQL** with Neon serverless
- **Drizzle Kit** for migrations
- **Connection pooling** for performance

## 📋 Prerequisites

Before setting up the project locally, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database (local or cloud)
- **Git** for version control

## 🏠 Local Setup Guide

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd propertyhub
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Database Setup

#### Option A: Local PostgreSQL Installation

1. **Install PostgreSQL** on your system:
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - **macOS**: Use Homebrew: `brew install postgresql`
   - **Linux**: `sudo apt-get install postgresql postgresql-contrib`

2. **Start PostgreSQL service**:
   ```bash
   # macOS (with Homebrew)
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   
   # Windows - Start from Services or pgAdmin
   ```

3. **Create database and user**:
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE propertyhub;
   
   # Create user (optional)
   CREATE USER propertyhub_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE propertyhub TO propertyhub_user;
   
   # Exit
   \q
   ```

#### Option B: Cloud Database (Recommended)

1. **Create a free Neon account** at [neon.tech](https://neon.tech)
2. **Create a new project** and database
3. **Copy the connection string** provided

### Step 4: Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/propertyhub"

# For Neon (cloud database), use the connection string provided:
# DATABASE_URL="postgresql://username:password@hostname:5432/dbname?sslmode=require"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secure-jwt-secret-key-here"

# Node Environment
NODE_ENV="development"

# Optional: Google Maps API Key (for enhanced maps)
VITE_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

### Step 5: Database Migration

Run the database migrations to create all required tables:

```bash
# Push schema to database
npm run db:push

# Optional: Generate migrations (for production)
npm run db:generate
```

### Step 6: Seed Sample Data

The application will automatically create sample properties when you first run it. If you want to add more sample data:

```bash
# Run the seed script
npm run seed
```

### Step 7: Start the Application

```bash
# Start both frontend and backend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:5000/api

## 🗄️ Database Schema

The application uses the following main tables:

### Users Table
```sql
- id (Primary Key)
- email (Unique)
- password (Hashed)
- name
- phone
- role (guest, user, agent, admin)
- is_verified
- profile_image_url
- created_at
- updated_at
```

### Properties Table
```sql
- id (Primary Key)
- title
- description
- price
- address
- city
- state
- zip_code
- bedrooms
- bathrooms
- sqft
- property_type (house, apartment, commercial)
- listing_type (sale, rent)
- latitude
- longitude
- images (Array)
- amenities (Array)
- is_featured
- is_available
- agent_id (Foreign Key to Users)
- created_at
- updated_at
```

### Inquiries Table
```sql
- id (Primary Key)
- property_id (Foreign Key)
- user_id (Foreign Key)
- name
- email
- phone
- message
- status (new, contacted, viewed, closed)
- created_at
```

### Saved Properties Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- property_id (Foreign Key)
- created_at
```

## 🚢 Deployment Options

### Option 1: Replit Deployment
1. Push your code to GitHub
2. Import to Replit
3. Set environment variables in Replit Secrets
4. Click "Deploy" button

### Option 2: Vercel/Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set up environment variables
4. Configure database connection

### Option 3: VPS/Cloud Server
1. Clone repository on server
2. Install dependencies: `npm install`
3. Set environment variables
4. Run with PM2: `pm2 start npm --name "propertyhub" -- run start`

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:push          # Push schema changes
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:studio        # Open Drizzle Studio

# Code quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript check
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/featured` - Get featured properties
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (agent/admin)
- `PUT /api/properties/:id` - Update property (agent/admin)
- `DELETE /api/properties/:id` - Delete property (agent/admin)

### User Actions
- `GET /api/saved-properties` - Get saved properties
- `POST /api/saved-properties/:id` - Save property
- `DELETE /api/saved-properties/:id` - Remove saved property
- `POST /api/inquiries` - Submit inquiry
- `GET /api/inquiries/my` - Get user's inquiries

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check connection string in `.env`
   - Ensure database exists

2. **Port Already in Use**
   ```bash
   # Kill process on port 5000
   lsof -ti:5000 | xargs kill -9
   ```

3. **Dependencies Issues**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Build Errors**
   - Check TypeScript errors: `npm run type-check`
   - Verify all imports are correct
   - Ensure environment variables are set

### Database Issues

1. **Migration Errors**
   ```bash
   # Reset database (development only)
   npm run db:push --force
   ```

2. **Connection Timeout**
   - Check firewall settings
   - Verify database credentials
   - Test connection with psql

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the troubleshooting section above

## 🔮 Future Enhancements

- [ ] Mobile app development
- [ ] Payment gateway integration
- [ ] Advanced analytics dashboard
- [ ] Property comparison tool
- [ ] Virtual property tours
- [ ] SMS notifications
- [ ] Social media integration
- [ ] Property valuation AI

---

**Built with ❤️ for the Pakistani real estate market**