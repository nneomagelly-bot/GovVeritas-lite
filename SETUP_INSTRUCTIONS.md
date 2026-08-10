# GovVeritas Lite v2.0 - Setup & Installation Guide

## Quick Start (5 Minutes)

### Prerequisites
- Node.js 16+ installed
- PostgreSQL 12+ installed and running
- Lovable account (optional, for deployment)

---

## Step 1: Database Setup

### 1a. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE govveritas_lite;
CREATE USER govveritas_user WITH PASSWORD 'secure_password_here';
ALTER ROLE govveritas_user SET client_encoding TO 'utf8';
ALTER ROLE govveritas_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE govveritas_user SET default_transaction_deferrable TO on;
ALTER ROLE govveritas_user SET default_time_zone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE govveritas_lite TO govveritas_user;

# Exit psql
\q
```

### 1b. Load Schema
```bash
# Run the database schema
psql -U govveritas_user -d govveritas_lite -f database_schema.sql

# Verify tables created
psql -U govveritas_user -d govveritas_lite -c "\dt"
```

### 1c. Seed Initial Users
```bash
# Create test user for Abia State
psql -U govveritas_user -d govveritas_lite << EOF
INSERT INTO users (id, state_id, email, full_name, role, password_hash, is_active)
SELECT 
  gen_random_uuid(),
  s.id,
  'chioma@abia.gov.ng',
  'Chioma Okafor',
  'coordinator',
  '\$2a\$10\$9P2PbNhD1qZ5p4u6Q8qKqOX5k3m1L9p2A0q3r5t6u7v8w9x0y1z2', -- demo123
  true
FROM states s WHERE s.state_name = 'Abia' LIMIT 1;

INSERT INTO users (id, state_id, email, full_name, role, password_hash, is_active)
SELECT 
  gen_random_uuid(),
  s.id,
  'amara@enugu.gov.ng',
  'Amara Obi',
  'coordinator',
  '\$2a\$10\$9P2PbNhD1qZ5p4u6Q8qKqOX5k3m1L9p2A0q3r5t6u7v8w9x0y1z2', -- demo123
  true
FROM states s WHERE s.state_name = 'Enugu' LIMIT 1;
EOF
```

---

## Step 2: Backend Setup

### 2a. Install Dependencies
```bash
cd backend
npm install
```

### 2b. Configure Environment
Create `.env` file:
```env
# Environment
NODE_ENV=development

# Server
PORT=3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=govveritas_lite
DB_USER=govveritas_user
DB_PASSWORD=secure_password_here

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production_123456

# AWS (Optional, for S3 file uploads)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=govveritas-documents
AWS_REGION=us-east-1

# CORS
FRONTEND_URL=http://localhost:5173

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### 2c. Start Backend Server
```bash
npm run dev
# Server runs at http://localhost:3001
```

Backend is ready when you see:
```
GovVeritas Lite API Server running on http://localhost:3001
```

---

## Step 3: Frontend Setup

### 3a. Install Dependencies
```bash
cd frontend
npm install
```

### 3b. Configure Environment
Create `.env` file:
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=GovVeritas Lite
VITE_ENABLE_DEBUG=false
```

### 3c. Start Frontend Server
```bash
npm run dev
# Frontend runs at http://localhost:5173
```

Frontend is ready when you see:
```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
```

---

## Step 4: Test Login

### Access Application
Open browser and go to: **http://localhost:5173**

### Demo Credentials
```
Email: chioma@abia.gov.ng
Password: demo123
```

You should see:
- ✓ Login page with GovVeritas Lite branding
- ✓ Dashboard with 78% readiness (sample data)
- ✓ Alerts and DLR list
- ✓ Navigation working

---

## Step 5: Deploy with Lovable

### 5a. Push to GitHub
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial GovVeritas Lite v2.0 commit"
git branch -M main
git remote add origin https://github.com/yourusername/govveritas-lite.git
git push -u origin main
```

### 5b. Deploy Backend (Option 1: Heroku)
```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create app
heroku create govveritas-lite-api

# Set environment variables
heroku config:set -a govveritas-lite-api \
  DB_HOST=your_rds_host \
  DB_PORT=5432 \
  DB_NAME=govveritas_lite \
  DB_USER=postgres \
  DB_PASSWORD=your_secure_password \
  JWT_SECRET=your_super_secret_key \
  NODE_ENV=production

# Deploy
git push heroku main
```

### 5c. Deploy Frontend (Option 1: Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd frontend
vercel

# Set environment variables in Vercel dashboard
VITE_API_URL=https://govveritas-lite-api.herokuapp.com/api
```

### 5d. Deploy with Lovable (Recommended)
1. Connect GitHub repository to Lovable
2. Lovable auto-deploys on git push
3. Set environment variables in Lovable dashboard
4. Frontend deployed to: `your-domain.lovable.dev`
5. Backend deployed to: `your-api.lovable.dev`

---

## Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Check environment variables
echo $DB_HOST $DB_PORT $DB_NAME
```

### Port Already in Use
```bash
# Find process using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
```

### JWT Token Invalid
- Clear localStorage: `localStorage.clear()`
- Log out and log back in
- Check JWT_SECRET matches between backend and token

### CORS Issues
- Check FRONTEND_URL in backend .env
- Verify correct origin in browser
- Ensure credentials: true in axios requests

### File Upload Not Working
- Check AWS credentials if using S3
- Verify S3 bucket exists and is public
- Check file size limits (max 50MB)

---

## Development Workflow

### Backend Development
```bash
cd backend
npm run dev      # Start with hot reload
npm test         # Run tests
npm run migrate  # Run database migrations
```

### Frontend Development
```bash
cd frontend
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Check code style
```

### Database Management
```bash
# Connect to database
psql -U govveritas_user -d govveritas_lite

# View all tables
\dt

# View table structure
\d states

# Run SQL query
SELECT * FROM states;
```

---

## Project Structure

```
govveritas-lite/
├── backend/
│   ├── server.js              # Express server
│   ├── package.json          
│   ├── .env                  # Environment variables
│   └── migrations/           # Database migrations
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── App.jsx         
│   │   └── index.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env
│
├── database/
│   └── schema.sql           # Database schema
│
└── README.md
```

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout (requires token)

### Dashboard
- `GET /api/dashboard/readiness` - Get dashboard data (requires auth)

### DLR Details
- `GET /api/dlr/:dlr_id/detail` - Get DLR details (requires auth)

### Documents
- `POST /api/documents/upload` - Upload evidence document (requires auth)

### Mock Verification
- `GET /api/mock-verification/:dlr_id` - Get mock verification results (requires auth)

### Health
- `GET /api/health` - Check server status (no auth required)

---

## Security Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Change database password from default
- [ ] Enable HTTPS in production
- [ ] Set CORS to specific domains (not *)
- [ ] Use environment variables for sensitive data
- [ ] Enable PostgreSQL backups
- [ ] Set up SSL for database connection
- [ ] Implement rate limiting for API
- [ ] Add request validation on backend
- [ ] Enable audit logging
- [ ] Set up error monitoring (Sentry)
- [ ] Enable database encryption at rest

---

## Performance Optimization

### Backend
- Enable query result caching with Redis
- Use database indexes (already in schema)
- Implement pagination for large result sets
- Enable gzip compression

### Frontend
- Use lazy loading for components
- Optimize images and assets
- Enable code splitting in Vite build
- Use React.memo for expensive components

---

## Monitoring & Logging

### Backend Logging
- Morgan for HTTP request logging
- Console logs for errors
- Winston for structured logging (optional)

### Frontend Monitoring
- Sentry for error tracking (optional)
- Google Analytics for usage tracking (optional)

### Database Monitoring
- PostgreSQL query logs
- Connection pool monitoring
- Slow query analysis

---

## Next Steps

1. ✓ Setup complete!
2. Configure for your state(s)
3. Customize styling/branding
4. Load real milestone data
5. Integrate document storage (S3)
6. Set up email notifications
7. Deploy to production
8. Train state coordinators

---

## Support & Troubleshooting

For issues:
1. Check error messages in terminal
2. Review logs in browser console (F12)
3. Check database connectivity
4. Review environment variables
5. See Troubleshooting section above

---

## Production Deployment Checklist

- [ ] All environment variables set
- [ ] Database backups enabled
- [ ] SSL/HTTPS configured
- [ ] Error monitoring active (Sentry)
- [ ] Performance monitoring active (DataDog/New Relic)
- [ ] Database connection pooling optimized
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] File upload quotas set
- [ ] Audit logging enabled
- [ ] Backup restoration tested
- [ ] DNS configured
- [ ] CDN configured for static assets
- [ ] Load testing completed
- [ ] Security audit completed

---

**GovVeritas Lite is now ready to use!** 🚀

For updates and support, visit: https://github.com/optegra-solutions/govveritas-lite
