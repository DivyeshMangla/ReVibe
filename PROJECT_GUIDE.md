# HR/Payroll System - Project Guide

## Overview

Production-grade HRMS payroll platform built with NestJS backend and React frontend. Supports payroll management, salary corrections, job profiles, promotions, and chatbot interactions.

**Stack**: Node.js + NestJS + PostgreSQL + Prisma + React + Vite + TypeScript + Tailwind CSS

## Folder Structure

```
ReVibe/
├── backend/
│   ├── src/
│   │   ├── auth/                 # JWT authentication stub
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/
│   │   │   └── guards/
│   │   ├── employees/            # Employee management
│   │   │   ├── employees.controller.ts
│   │   │   ├── employees.service.ts
│   │   │   ├── employees.module.ts
│   │   │   └── dto/
│   │   ├── job-profiles/         # Job profile history
│   │   │   ├── job-profiles.controller.ts
│   │   │   ├── job-profiles.service.ts
│   │   │   ├── job-profiles.module.ts
│   │   │   └── dto/
│   │   ├── payroll/              # Payroll runs & salary slips
│   │   │   ├── payroll.controller.ts
│   │   │   ├── payroll.service.ts
│   │   │   ├── payroll.module.ts
│   │   │   └── dto/
│   │   ├── promotions/           # Promotion workflow
│   │   │   ├── promotions.controller.ts
│   │   │   ├── promotions.service.ts
│   │   │   ├── promotions.module.ts
│   │   │   └── dto/
│   │   ├── salary-corrections/   # Salary slip corrections
│   │   │   ├── salary-corrections.controller.ts
│   │   │   ├── salary-corrections.service.ts
│   │   │   ├── salary-corrections.module.ts
│   │   │   └── dto/
│   │   ├── chatbot/              # HR chatbot stub
│   │   │   ├── chatbot.controller.ts
│   │   │   ├── chatbot.service.ts
│   │   │   ├── chatbot.module.ts
│   │   │   └── adapters/
│   │   ├── utils/                # Shared utilities
│   │   │   ├── date.util.ts
│   │   │   ├── validation.util.ts
│   │   │   └── payroll-math.util.ts
│   │   ├── common/               # Common filters/pipes
│   │   │   └── filters/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── nest-cli.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── payroll/
│   │   │   ├── employees/
│   │   │   ├── promotions/
│   │   │   └── chatbot/
│   │   ├── pages/
│   │   │   ├── PayrollDashboard.tsx
│   │   │   ├── PayrollRunView.tsx
│   │   │   ├── EmployeeProfileView.tsx
│   │   │   ├── PromotionsPanel.tsx
│   │   │   ├── SalaryCorrectionsView.tsx
│   │   │   └── ChatbotPanel.tsx
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── payroll.api.ts
│   │   │   ├── employees.api.ts
│   │   │   ├── promotions.api.ts
│   │   │   └── corrections.api.ts
│   │   ├── state/
│   │   │   └── auth.store.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── PROJECT_GUIDE.md
```

## Data Models

```
┌─────────────┐         ┌──────────────┐
│  Employee   │────────>│ JobProfile   │
│  (Core)     │         │  (History)   │
└─────────────┘         └──────────────┘
       │
       │ 1:N
       ↓
┌─────────────┐         ┌──────────────┐
│ SalarySlip  │────────>│  Correction  │
│             │         │  (Requests)  │
└─────────────┘         └──────────────┘
       │
       │ N:1
       ↓
┌─────────────┐
│ PayrollRun  │
│ (Batch)     │
└─────────────┘

┌─────────────┐
│  Promotion  │
│ (Workflow)  │
└─────────────┘

┌─────────────┐
│   ChatMsg   │
│   (Stub)    │
└─────────────┘
```

### Prisma Schema Overview

**Employee**: id, empCode, name, email, department, hireDate, status  
**JobProfile**: id, employeeId, role, department, responsibilities, effectiveDate  
**PayrollRun**: id, month, year, status (DRAFT/APPROVED/FINALIZED), createdAt  
**SalarySlip**: id, employeeId, payrollRunId, basicSalary, earnings, deductions, netPay, version  
**Correction**: id, salarySlipId, requestedBy, reason, changes, status, approvedBy  
**Promotion**: id, employeeId, currentRole, proposedRole, salaryIncrease, status, effectiveDate  
**ChatMessage**: id, userId, message, response, timestamp

## REST API Reference

### Authentication
```
POST   /api/auth/login           # Login (returns JWT)
POST   /api/auth/register        # Register user (stub)
```

### Employees
```
GET    /api/employees            # List all employees
GET    /api/employees/:id        # Get employee details
POST   /api/employees            # Create employee
PUT    /api/employees/:id        # Update employee
DELETE /api/employees/:id        # Deactivate employee
```

### Job Profiles
```
GET    /api/job-profiles/:employeeId           # Get job history
POST   /api/job-profiles                       # Create new profile entry
PUT    /api/job-profiles/:id                   # Update profile
```

### Payroll
```
GET    /api/payroll/runs                       # List payroll runs
GET    /api/payroll/runs/:id                   # Get run details
POST   /api/payroll/runs                       # Create payroll run (DRAFT)
PUT    /api/payroll/runs/:id/approve           # Approve run
PUT    /api/payroll/runs/:id/finalize          # Finalize run
GET    /api/payroll/slips/:id                  # Get salary slip
GET    /api/payroll/slips/:id/pdf              # Generate PDF (stub)
POST   /api/payroll/calculate                  # Calculate salary components
```

### Salary Corrections
```
GET    /api/corrections                        # List all corrections
GET    /api/corrections/:id                    # Get correction details
POST   /api/corrections                        # Request correction
PUT    /api/corrections/:id/approve            # Approve correction
PUT    /api/corrections/:id/reject             # Reject correction
```

### Promotions
```
GET    /api/promotions                         # List promotions
GET    /api/promotions/:id                     # Get promotion details
POST   /api/promotions                         # Create promotion proposal
PUT    /api/promotions/:id/approve             # Approve promotion (triggers profile update)
PUT    /api/promotions/:id/reject              # Reject promotion
```

### Chatbot
```
POST   /api/chatbot/message                    # Send message to bot
GET    /api/chatbot/history/:userId            # Get chat history
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Backend Setup

1. **Navigate to backend folder**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

Environment variables:
```
DATABASE_URL="postgresql://user:password@localhost:5432/hrms_payroll"
JWT_SECRET="your-secret-key"
PORT=3000
```

4. **Setup database**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. **Seed initial data (optional)**
```bash
npx prisma db seed
```

6. **Run development server**
```bash
npm run start:dev
```

Backend runs on http://localhost:3000

### Frontend Setup

1. **Navigate to frontend folder**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API endpoint**
Edit `src/api/client.ts` to point to backend URL

4. **Run development server**
```bash
npm run dev
```

Frontend runs on http://localhost:5173

### Database Migration
```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## Key Workflows

### Payroll Run Lifecycle

1. **Create Draft Run**
   - POST `/api/payroll/runs` with month/year
   - Status: DRAFT
   - Generates salary slips for all active employees

2. **Calculate Components**
   - System calculates: basic, HRA, DA, PF, ESI, TDS (stub logic)
   - Earnings and deductions stored in SalarySlip

3. **Approval**
   - PUT `/api/payroll/runs/:id/approve`
   - Status: APPROVED
   - Slips become visible to employees

4. **Finalization**
   - PUT `/api/payroll/runs/:id/finalize`
   - Status: FINALIZED
   - Triggers payment processing (stub)

### Salary Correction Workflow

1. **Employee/HR requests correction**
   - POST `/api/corrections`
   - Include: salarySlipId, reason, proposed changes

2. **Approver reviews**
   - GET `/api/corrections/:id`
   - View original vs proposed values

3. **Approve or Reject**
   - PUT `/api/corrections/:id/approve`
   - Creates new salary slip version
   - Updates netPay

### Promotion Workflow

1. **Create Promotion Proposal**
   - POST `/api/promotions`
   - Include: employeeId, proposedRole, salaryIncrease, effectiveDate

2. **Approval**
   - PUT `/api/promotions/:id/approve`
   - Auto-creates new JobProfile entry
   - Updates employee base salary

3. **Effect Date**
   - System applies promotion on effectiveDate
   - Reflects in next payroll run

### Job Profile Management

1. **Initial Profile**
   - Created during employee onboarding
   - Links role, department, responsibilities

2. **History Tracking**
   - Each promotion/transfer creates new JobProfile entry
   - effectiveDate determines active profile

3. **Query History**
   - GET `/api/job-profiles/:employeeId`
   - Returns chronological list of roles

## Extension Notes for AI/LLM Agents

### Architecture Principles
- **Modular Design**: Each feature in separate NestJS module
- **Service Layer**: Business logic isolated in services
- **DTO Validation**: Use class-validator decorators
- **Prisma ORM**: Type-safe database queries

### Adding New Features

1. **New Module**: Use NestJS CLI
```bash
nest generate module feature-name
nest generate controller feature-name
nest generate service feature-name
```

2. **Database Changes**: Update `schema.prisma`, then migrate
```bash
npx prisma migrate dev --name add_feature
```

3. **Frontend Page**: Create in `src/pages/`, add route in App.tsx

### Chatbot LLM Integration

Current implementation is a stub. To integrate real LLM:

1. **Update Adapter Interface** (`backend/src/chatbot/adapters/llm-adapter.interface.ts`)
   - Define methods: sendMessage(), streamResponse()

2. **Implement Provider** (e.g., OpenAI, Anthropic)
   - Create adapter class implementing interface
   - Add API key to .env

3. **Context Injection**
   - Pass employee data, payroll context to LLM
   - Use RAG for policy documents

4. **Response Processing**
   - Parse structured responses
   - Trigger actions (e.g., correction requests)

### Payroll Calculation Hooks

Located in `backend/src/utils/payroll-math.util.ts`:

- **calculatePF()**: Provident Fund logic
- **calculateESI()**: Employee State Insurance
- **calculateTDS()**: Tax Deduction at Source
- **calculateHRA()**: House Rent Allowance

Replace stub implementations with actual formulas based on regional compliance.

### PDF Generation

Salary slip PDF endpoint (`/api/payroll/slips/:id/pdf`) returns stub.

To implement:
1. Install `@react-pdf/renderer` or `puppeteer`
2. Create template in `backend/src/payroll/templates/`
3. Populate with SalarySlip data
4. Return PDF buffer with proper headers

### Authentication Enhancement

Current JWT implementation is minimal. To enhance:
1. Add refresh tokens (new table in Prisma)
2. Implement role-based guards (admin, manager, employee)
3. Add password hashing with bcrypt
4. Implement session management

### Deployment Checklist

- [ ] Set strong JWT_SECRET in production
- [ ] Enable CORS with specific origins
- [ ] Use environment-specific database URLs
- [ ] Enable Prisma query logging (production: warn only)
- [ ] Add rate limiting middleware
- [ ] Setup SSL/TLS certificates
- [ ] Configure reverse proxy (nginx)
- [ ] Enable database connection pooling
- [ ] Add health check endpoint
- [ ] Setup monitoring (Sentry, LogRocket)

### Common Iteration Patterns

**Adding a new salary component:**
1. Add field to SalarySlip model
2. Update payroll calculation service
3. Modify frontend slip display component

**Adding approval layer:**
1. Add approver fields to model
2. Create approval DTO and endpoint
3. Add status transitions in service
4. Update frontend with approval UI

**Versioning data:**
1. Add `version` field to model
2. Implement soft deletes or history tables
3. Create version comparison endpoint
4. Show version diff in frontend

### Performance Optimization

- Use Prisma `select` to limit fields
- Implement pagination for large lists
- Add database indexes on frequently queried fields
- Cache static data (job roles, departments)
- Use React Query for client-side caching

### Testing Strategy (When Needed)

Though no tests are included, recommended structure:
- **Unit Tests**: Service logic, utility functions
- **Integration Tests**: API endpoints with test database
- **E2E Tests**: Critical user flows (payroll run, approvals)

Use Jest for backend, Vitest for frontend.

---

**Project Version**: 1.0.0  
**Last Updated**: 2025-11-14  
**Maintainer**: Development Team
