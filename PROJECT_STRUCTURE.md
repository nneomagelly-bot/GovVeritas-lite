# GovVeritas Lite v2.0 - Project Structure

## Complete Directory Layout

```
govveritas-lite/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── env.js
│   │   │   └── constants.js
│   │   ├── models/
│   │   │   ├── State.js
│   │   │   ├── EligibilityCriteria.js
│   │   │   ├── DLR.js
│   │   │   ├── Milestone.js
│   │   │   ├── EvidenceDocument.js
│   │   │   └── MockVerification.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── dashboard.js
│   │   │   ├── dlr.js
│   │   │   ├── documents.js
│   │   │   ├── reports.js
│   │   │   └── admin.js
│   │   ├── services/
│   │   │   ├── mockVerificationService.js
│   │   │   ├── reportGeneratorService.js
│   │   │   ├── documentValidationService.js
│   │   │   └── readinessScoringService.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── requestLogger.js
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   ├── helpers.js
│   │   │   └── calculations.js
│   │   └── app.js
│   ├── migrations/
│   │   ├── 001_create_tables.sql
│   │   ├── 002_load_states.sql
│   │   ├── 003_load_ecs_dlrs.sql
│   │   └── 004_load_milestones.sql
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── LogoutButton.jsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── DashboardPage.jsx
│   │   │   │   ├── ReadinessRadar.jsx
│   │   │   │   ├── AlertsPanel.jsx
│   │   │   │   ├── DLRList.jsx
│   │   │   │   └── StatCard.jsx
│   │   │   ├── DLRDetail/
│   │   │   │   ├── DLRDetailPage.jsx
│   │   │   │   ├── MilestoneTimeline.jsx
│   │   │   │   ├── DocumentsPanel.jsx
│   │   │   │   ├── MockVerificationCard.jsx
│   │   │   │   └── RemediationChecklist.jsx
│   │   │   ├── Documents/
│   │   │   │   ├── DocumentUpload.jsx
│   │   │   │   └── DocumentList.jsx
│   │   │   ├── Reports/
│   │   │   │   ├── ReportsPage.jsx
│   │   │   │   ├── ReportViewer.jsx
│   │   │   │   └── ReportDownload.jsx
│   │   │   ├── Common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Navigation.jsx
│   │   │   │   ├── StatusBadge.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   └── ErrorBoundary.jsx
│   │   │   ├── Layout/
│   │   │   │   └── MainLayout.jsx
│   │   │   └── App.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useFetch.js
│   │   │   ├── useReadiness.js
│   │   │   └── useMockVerification.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   └── storage.js
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── tailwind.css
│   │   │   └── theme.css
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DLRDetail.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── Login.jsx
│   │   └── index.jsx
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── logo.png
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── database/
│   ├── schema.sql
│   ├── seeds.sql
│   └── README.md
│
├── docs/
│   ├── API.md
│   ├── SETUP.md
│   ├── ARCHITECTURE.md
│   └── CONTRIBUTING.md
│
├── .gitignore
├── docker-compose.yml
├── README.md
└── LICENSE

```

## Key Technologies

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Cache**: Redis (optional, for performance)
- **File Storage**: AWS S3 or local file system
- **Authentication**: JWT
- **Deployment**: Docker, Docker Compose

## Environment Setup

### Backend (.env)
```
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=govveritas_lite
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_jwt_secret_here
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=govveritas-documents
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=GovVeritas Lite
```

## Setup Instructions

### 1. Install Dependencies

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

### 2. Database Setup

```bash
# Create database
createdb govveritas_lite

# Run migrations
psql -U postgres -d govveritas_lite -f database/schema.sql
psql -U postgres -d govveritas_lite -f database/seeds.sql
```

### 3. Start Development Servers

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

### 4. Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- API Documentation: http://localhost:3001/api/docs

## File Organization Rationale

- **config/**: Centralized configuration management
- **models/**: Database models and schemas
- **routes/**: API endpoint definitions
- **services/**: Business logic (mock verification, scoring, etc.)
- **middleware/**: Express middleware for auth, logging, error handling
- **components/**: React UI components organized by feature
- **hooks/**: Custom React hooks for shared logic
- **services/**: Frontend API client and utility services

This structure makes it easy to:
- Find specific functionality
- Test individual components
- Maintain and extend the codebase
- Onboard new team members
