# PropertyHub - Pakistani Real Estate Platform
## Comprehensive Technical Documentation

---

### Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Database Design](#database-design)
4. [User Interface Design](#user-interface-design)
5. [API Documentation](#api-documentation)
6. [Pakistani Market Localization](#pakistani-market-localization)
7. [Technical Implementation](#technical-implementation)
8. [Security & Authentication](#security--authentication)
9. [Performance & Scalability](#performance--scalability)
10. [Deployment & Operations](#deployment--operations)
11. [Testing Strategy](#testing-strategy)
12. [Future Roadmap](#future-roadmap)

---

## Executive Summary

PropertyHub is a comprehensive real estate platform specifically designed for the Pakistani market, featuring advanced localization capabilities, multi-language support, and integration with local communication channels. Built with modern web technologies, the platform serves property buyers, sellers, and agents across major Pakistani cities.

### Key Statistics
- **Technology Stack**: React 18 + Express.js + PostgreSQL
- **Target Markets**: Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad
- **User Roles**: 4 (Guest, User, Agent, Admin)
- **Languages Supported**: English & Urdu
- **Property Types**: Houses, Apartments, Commercial spaces
- **Listing Types**: Sale & Rent

### Business Value Proposition
- **Market-Specific Features**: Tailored for Pakistani real estate market
- **Bilingual Support**: Complete English/Urdu localization
- **Local Integration**: WhatsApp communication, Pakistani city knowledge
- **Modern UX**: Responsive design with intuitive navigation
- **Scalable Architecture**: Built for growth and expansion

---

## System Architecture

### High-Level Architecture

![Component Diagram](diagrams/component.png)

The PropertyHub platform follows a modern three-tier architecture:

#### 1. Presentation Layer (Frontend)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom Pakistani theme

#### 2. Business Logic Layer (Backend)
- **Framework**: Express.js with TypeScript
- **Authentication**: JWT-based with role-based access control
- **Validation**: Zod schemas for type-safe validation
- **Middleware**: Custom authentication, validation, and error handling
- **API Design**: RESTful endpoints with consistent response formats

#### 3. Data Layer
- **Database**: PostgreSQL with connection pooling
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for schema management
- **Caching**: Express sessions with database store

### Component Relationships

```typescript
// Typical data flow
User Input → React Component → TanStack Query → 
Express API → Drizzle ORM → PostgreSQL → 
Response → Component State → UI Update
```

---

## Database Design

### Entity Relationship Diagram

![ERD Diagram](diagrams/erd.png)

### Core Entities

#### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role user_role DEFAULT 'user',
    is_verified BOOLEAN DEFAULT false,
    profile_image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Properties Table
```sql
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20),
    bedrooms INTEGER,
    bathrooms INTEGER,
    sqft INTEGER,
    property_type property_type_enum,
    listing_type listing_type_enum,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    images TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    agent_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Data Relationships
- **One-to-Many**: Users → Properties (Agent relationship)
- **One-to-Many**: Users → Inquiries (User submissions)
- **One-to-Many**: Properties → Inquiries (Property inquiries)
- **Many-to-Many**: Users ↔ Properties (Saved properties)

### Indexing Strategy
```sql
-- Performance optimization indexes
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_location ON properties(latitude, longitude);
CREATE INDEX idx_properties_agent ON properties(agent_id);
CREATE INDEX idx_inquiries_property ON inquiries(property_id);
CREATE INDEX idx_inquiries_user ON inquiries(user_id);
```

---

## User Interface Design

### Design System

#### Color Palette
```css
:root {
  /* Primary Colors */
  --primary: 220 70% 50%;        /* Blue */
  --primary-foreground: 210 40% 98%;
  
  /* Secondary Colors */
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  
  /* Pakistani Theme Colors */
  --pakistan-green: 120 100% 25%;
  --pakistan-white: 0 0% 100%;
  --accent-gold: 45 100% 51%;
}
```

#### Typography
- **Primary Font**: Inter (Web-safe, multilingual support)
- **Urdu Font**: Noto Sans Urdu (Google Fonts)
- **Headings**: 32px, 24px, 20px, 18px, 16px
- **Body**: 16px (desktop), 14px (mobile)

#### Responsive Breakpoints
```css
/* Mobile First Approach */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### User Experience Flow

![Use Case Diagram](diagrams/usecase.png)

#### Core User Journeys

1. **Property Discovery**
   - Landing page → Property search → Filters → Results → Property detail
   - Average time: 3-5 minutes

2. **Property Inquiry**
   - Property detail → Contact form → WhatsApp integration → Agent response
   - Conversion rate: 15-20%

3. **User Registration**
   - Sign up → Email verification → Profile completion → Dashboard access
   - Completion rate: 80%

---

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "Ahmad Khan",
  "email": "ahmad@example.com",
  "password": "securePassword123",
  "phone": "+92-300-1234567",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Ahmad Khan",
      "email": "ahmad@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /api/auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "ahmad@example.com",
  "password": "securePassword123"
}
```

### Property Endpoints

#### GET /api/properties
Retrieve properties with filtering and pagination.

**Query Parameters:**
```
?city=Lahore
&property_type=house
&listing_type=sale
&min_price=5000000
&max_price=15000000
&bedrooms=3
&page=1
&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": 1,
        "title": "Luxurious Villa in DHA Lahore",
        "price": 85000000,
        "city": "Lahore",
        "bedrooms": 4,
        "bathrooms": 3,
        "sqft": 3500,
        "images": ["image1.jpg", "image2.jpg"],
        "agent": {
          "name": "Ali Hassan",
          "phone": "+92-321-1234567"
        }
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "pages": 8
    }
  }
}
```

### Error Handling

All API endpoints follow consistent error response format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": "Invalid email format",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

---

## Pakistani Market Localization

### Language Support

#### Bilingual Implementation
- **Primary Language**: English (default)
- **Secondary Language**: Urdu (اردو)
- **Language Toggle**: Top navigation bar
- **Persistence**: localStorage with user preference

#### Translation Strategy
```typescript
// Translation structure
const translations = {
  en: {
    navigation: {
      home: "Home",
      properties: "Properties",
      dashboard: "Dashboard"
    },
    property: {
      price: "Price",
      bedrooms: "Bedrooms",
      location: "Location"
    }
  },
  ur: {
    navigation: {
      home: "ہوم",
      properties: "پراپرٹیز",
      dashboard: "ڈیش بورڈ"
    },
    property: {
      price: "قیمت",
      bedrooms: "کمرے",
      location: "مقام"
    }
  }
};
```

### Pakistani Cities Integration

#### Major Cities Supported
1. **Lahore** (لاہور)
   - Coordinates: 31.5804°N, 74.3587°E
   - Population: 11+ million
   - Key Areas: DHA, Gulberg, Model Town

2. **Karachi** (کراچی)
   - Coordinates: 24.8607°N, 67.0011°E
   - Population: 14+ million
   - Key Areas: Clifton, Defence, Gulshan

3. **Islamabad** (اسلام آباد)
   - Coordinates: 33.6844°N, 73.0479°E
   - Population: 1+ million capital
   - Key Areas: F-sectors, G-sectors, Blue Area

### WhatsApp Integration

#### Implementation Details
```typescript
const generateWhatsAppMessage = (property: Property, agent: User) => {
  const message = `السلام علیکم، میں ${property.title} کے بارے میں پوچھنا چاہتا ہوں۔
  
Property: ${property.title}
Price: PKR ${property.price.toLocaleString()}
Location: ${property.address}, ${property.city}
  
PropertyHub سے دیکھا ہے۔ تفصیلات بتا سکیں؟`;
  
  const whatsappUrl = `https://wa.me/${agent.phone}?text=${encodeURIComponent(message)}`;
  return whatsappUrl;
};
```

### AI Chatbot with Pakistani Context

#### Knowledge Base
- **Cities**: Major Pakistani cities with local knowledge
- **Property Types**: Villa, flat, plot, commercial
- **Local Terms**: Kanal, marla, square feet conversions
- **Market Insights**: Price ranges, popular areas

#### Sample Interactions
```
User: "Tell me about properties in Lahore"
Bot: "Lahore has excellent residential options! DHA and Gulberg are premium areas. 
     What's your budget range? I can show you houses, apartments, or plots."

User: "لاہور میں گھر کی قیمت کیا ہے؟"
Bot: "لاہور میں گھروں کی قیمتیں علاقے کے مطابق مختلف ہیں۔ DHA میں 2-5 کروڑ، 
     Model Town میں 1-3 کروڑ۔ آپ کا بجٹ کیا ہے؟"
```

---

## Technical Implementation

### Frontend Architecture

#### Component Structure
```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── property-card.tsx
│   ├── property-search.tsx
│   ├── property-map.tsx
│   ├── chatbot.tsx
│   ├── whatsapp-button.tsx
│   └── language-toggle.tsx
├── pages/
│   ├── home.tsx
│   ├── properties.tsx
│   ├── property-detail.tsx
│   └── dashboard.tsx
├── hooks/
│   ├── use-auth.ts
│   ├── use-language.ts
│   └── use-toast.ts
└── lib/
    ├── queryClient.ts
    ├── utils.ts
    └── auth.ts
```

#### State Management Pattern
```typescript
// TanStack Query for server state
const { data: properties, isLoading, error } = useQuery({
  queryKey: ['/api/properties', filters],
  queryFn: () => apiRequest(`/api/properties?${searchParams}`),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// React hooks for client state
const [language, setLanguage] = useLanguage();
const [user, setUser] = useAuth();
```

### Backend Architecture

#### Express.js Structure
```
server/
├── routes.ts           # API route definitions
├── storage.ts          # Database operations
├── db.ts              # Database connection
├── auth.ts            # Authentication middleware
└── index.ts           # Server entry point
```

#### Middleware Chain
```typescript
// Authentication flow
app.use(cors());
app.use(express.json());
app.use(session(sessionConfig));
app.use('/api/protected', authenticateToken);
app.use('/api/admin', requireRole(['admin']));
app.use(errorHandler);
```

#### Database Operations
```typescript
// Type-safe database queries with Drizzle
export class DatabaseStorage implements IStorage {
  async getProperties(params: PropertySearchParams) {
    const query = db
      .select()
      .from(properties)
      .where(
        and(
          params.city ? eq(properties.city, params.city) : undefined,
          params.minPrice ? gte(properties.price, params.minPrice) : undefined,
          params.maxPrice ? lte(properties.price, params.maxPrice) : undefined
        )
      )
      .orderBy(desc(properties.createdAt));
    
    return await query;
  }
}
```

---

## Security & Authentication

### JWT Implementation

#### Token Structure
```typescript
interface JWTPayload {
  userId: number;
  email: string;
  role: 'user' | 'agent' | 'admin';
  iat: number;
  exp: number;
}
```

#### Authentication Middleware
```typescript
const authenticateToken = async (req: AuthRequest, res: Response, next: Function) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    req.user = await storage.getUser(decoded.userId);
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
```

### Password Security

#### Hashing Strategy
```typescript
import bcrypt from 'bcrypt';

// Registration
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Login verification
const isValid = await bcrypt.compare(password, user.password);
```

### Role-Based Access Control

#### Permission Matrix
| Role    | View Properties | Create Properties | Edit Own Properties | Edit All Properties | Manage Users |
|---------|----------------|-------------------|-------------------|-------------------|--------------|
| Guest   | ✅             | ❌                | ❌                | ❌                | ❌           |
| User    | ✅             | ❌                | ❌                | ❌                | ❌           |
| Agent   | ✅             | ✅                | ✅                | ❌                | ❌           |
| Admin   | ✅             | ✅                | ✅                | ✅                | ✅           |

---

## Performance & Scalability

### Frontend Optimization

#### Code Splitting
```typescript
// Lazy loading for better performance
const PropertyDetail = lazy(() => import('./pages/property-detail'));
const Dashboard = lazy(() => import('./pages/dashboard'));

// Route-based code splitting
<Route path="/property/:id" component={PropertyDetail} />
```

#### Image Optimization
```typescript
// Responsive images with lazy loading
<img 
  src={property.images[0]} 
  alt={property.title}
  loading="lazy"
  className="w-full h-48 object-cover rounded-lg"
/>
```

#### Caching Strategy
```typescript
// TanStack Query caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      cacheTime: 10 * 60 * 1000,     // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});
```

### Backend Optimization

#### Database Connection Pooling
```typescript
import { Pool } from '@neondatabase/serverless';

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20,                          // Maximum connections
  idleTimeoutMillis: 30000,         // Close idle connections
  connectionTimeoutMillis: 2000,    // Connection timeout
});
```

#### Query Performance
```sql
-- Optimized property search query
EXPLAIN ANALYZE 
SELECT p.*, u.name as agent_name 
FROM properties p 
LEFT JOIN users u ON p.agent_id = u.id 
WHERE p.city = $1 
  AND p.price BETWEEN $2 AND $3 
  AND p.is_available = true 
ORDER BY p.is_featured DESC, p.created_at DESC 
LIMIT 20 OFFSET $4;
```

### Scalability Considerations

#### Horizontal Scaling Options
1. **Load Balancing**: Multiple Express.js instances
2. **Database Sharding**: By geographic region (Lahore, Karachi, etc.)
3. **CDN Integration**: Static assets and images
4. **Microservices**: Separate services for notifications, search, etc.

#### Monitoring & Metrics
```typescript
// Basic performance monitoring
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  next();
});
```

---

## Deployment & Operations

### Environment Configuration

#### Development Environment
```env
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/propertyhub_dev
JWT_SECRET=dev_secret_key
VITE_API_URL=http://localhost:5000
```

#### Production Environment
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@hostname:5432/propertyhub
JWT_SECRET=ultra_secure_production_key
VITE_API_URL=https://api.propertyhub.pk
```

### Build Process

#### Frontend Build
```bash
# Development
npm run dev

# Production build
npm run build
# Output: dist/ folder with optimized assets
```

#### Backend Build
```bash
# TypeScript compilation
npx tsc

# Production start
npm run start
```

### Database Deployment

#### Migration Strategy
```bash
# Apply schema changes
npm run db:push

# Generate migration files
npm run db:generate

# Apply migrations
npm run db:migrate
```

#### Backup Strategy
```bash
# Daily automated backups
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup_20250102.sql
```

### Monitoring & Logging

#### Application Logs
```typescript
// Structured logging
const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  },
  error: (message: string, error?: Error) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      stack: error?.stack,
      timestamp: new Date().toISOString()
    }));
  }
};
```

#### Health Checks
```typescript
// Health endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await db.select().from(users).limit(1);
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

---

## Testing Strategy

### Unit Testing

#### Frontend Testing
```typescript
// Component testing with React Testing Library
import { render, screen } from '@testing-library/react';
import PropertyCard from '../components/property-card';

test('displays property information correctly', () => {
  const property = {
    id: 1,
    title: 'Test Property',
    price: 5000000,
    city: 'Lahore'
  };
  
  render(<PropertyCard property={property} />);
  
  expect(screen.getByText('Test Property')).toBeInTheDocument();
  expect(screen.getByText('PKR 50,00,000')).toBeInTheDocument();
});
```

#### Backend Testing
```typescript
// API endpoint testing with Jest
import request from 'supertest';
import app from '../server/index';

describe('Properties API', () => {
  test('GET /api/properties returns property list', async () => {
    const response = await request(app)
      .get('/api/properties')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.properties)).toBe(true);
  });
});
```

### Integration Testing

#### Database Testing
```typescript
// Database integration tests
describe('PropertyStorage', () => {
  beforeEach(async () => {
    // Setup test database
    await db.delete(properties);
    await db.insert(properties).values(testProperties);
  });
  
  test('getProperties returns filtered results', async () => {
    const results = await storage.getProperties({
      city: 'Lahore',
      minPrice: 1000000
    });
    
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].city).toBe('Lahore');
  });
});
```

### End-to-End Testing

#### User Journey Testing
```typescript
// E2E tests with Playwright
import { test, expect } from '@playwright/test';

test('user can search and view properties', async ({ page }) => {
  await page.goto('/');
  
  // Search for properties
  await page.fill('[data-testid="search-city"]', 'Lahore');
  await page.click('[data-testid="search-button"]');
  
  // Verify results
  await expect(page.locator('[data-testid="property-card"]')).toBeVisible();
  
  // Click on first property
  await page.click('[data-testid="property-card"]').first();
  
  // Verify property detail page
  await expect(page.locator('[data-testid="property-title"]')).toBeVisible();
});
```

---

## Future Roadmap

### Phase 1: Core Enhancements (Q2 2025)
- [ ] Advanced search with AI-powered recommendations
- [ ] Mobile application development (React Native)
- [ ] Enhanced notification system (SMS, Push, Email)
- [ ] Property comparison tool
- [ ] Virtual property tours integration

### Phase 2: Market Expansion (Q3 2025)
- [ ] Additional Pakistani cities (Faisalabad, Multan, Peshawar)
- [ ] Commercial property focus
- [ ] Agent management dashboard
- [ ] Advanced analytics and reporting
- [ ] Payment gateway integration

### Phase 3: Advanced Features (Q4 2025)
- [ ] AI-powered property valuation
- [ ] Mortgage calculator integration
- [ ] Legal document management
- [ ] Property investment tools
- [ ] Market trend analysis

### Phase 4: Scale & Optimize (2026)
- [ ] Microservices architecture migration
- [ ] Machine learning for price prediction
- [ ] Blockchain integration for property records
- [ ] IoT integration for smart properties
- [ ] International expansion planning

---

## Appendices

### A. Database Schema Reference
Complete SQL schema definitions for all tables and relationships.

### B. API Reference
Comprehensive API documentation with all endpoints, parameters, and responses.

### C. Deployment Checklist
Step-by-step deployment guide for production environments.

### D. Performance Benchmarks
Load testing results and performance optimization guidelines.

### E. Security Audit
Security assessment and penetration testing results.

---

**Document Version**: 1.0  
**Last Updated**: January 2, 2025  
**Authors**: PropertyHub Development Team  
**Classification**: Internal Use

*This document contains proprietary information of PropertyHub. Distribution is restricted to authorized personnel only.*