# Local End-to-End Testing Guide

This system is **fully testable offline** with zero external dependencies.

## Prerequisites

1. **PostgreSQL** running locally
   - Install: https://www.postgresql.org/download/
   - Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`

2. **Node.js 18+** installed

## Step-by-Step Setup

### 1. Database Setup

```bash
# Create database (if using psql)
psql -U postgres
CREATE DATABASE hrms_payroll;
\q
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure database connection
cp .env.example .env
# Edit .env - set your PostgreSQL connection string:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hrms_payroll"

# Run migrations
npx prisma migrate dev --name init

# Seed test data
npx prisma db seed

# Start backend server
npm run start:dev
```

**Backend should start on:** http://localhost:3000

### 3. Frontend Setup

```bash
# In a NEW terminal
cd frontend

# Install dependencies
npm install

# Start frontend dev server
npm run dev
```

**Frontend should start on:** http://localhost:5173

## End-to-End Test Flow

### 1. Login
- Open http://localhost:5173
- You'll be redirected to login page
- Enter any valid email (e.g., `test@example.com`)
- Enter any password (min 6 chars, e.g., `password123`)
- Click Login
- ✅ You should be redirected to Payroll Dashboard

### 2. Test Payroll Dashboard
- Should see 1 payroll run (November 2025, DRAFT status)
- Should see 3 salary slips with employee data
- Click "View Details" on the run
- ✅ Should navigate to detailed view with all slips

### 3. Test Payroll Run Actions
- On the run detail page, click "Approve Run"
- ✅ Status should change to APPROVED
- Click "Finalize Run"
- ✅ Status should change to FINALIZED

### 4. Test Promotions
- Click "Promotions" in navbar
- Should see 1 pending promotion for Bob Johnson
- Click "Approve" button
- ✅ Status should change to APPROVED
- ✅ New job profile created automatically

### 5. Test Salary Corrections
- Click "Corrections" in navbar
- Should see 1 pending correction request
- Click "Approve" button
- ✅ Correction should be approved
- ✅ Salary slip version incremented

### 6. Test Employee Profile
- Click "Employees" in navbar (or manually navigate to `/employees/<employee-id>`)
- Should see employee details and job profile history
- ✅ All data displays correctly

### 7. Test Chatbot
- Click "Chatbot" in navbar
- Type: "What is my salary?"
- ✅ Bot responds with stub message
- Type: "How do I apply for promotion?"
- ✅ Bot responds with relevant stub message
- ✅ Chat history persists in database

## Verification Checklist

### Backend Verification
```bash
# Test API endpoints directly
curl http://localhost:3000/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Should return JWT token and user object
```

### Database Verification
```bash
# Connect to database
psql -U postgres -d hrms_payroll

# Check seeded data
SELECT COUNT(*) FROM employees;  -- Should return 3
SELECT COUNT(*) FROM payroll_runs;  -- Should return 1
SELECT COUNT(*) FROM salary_slips;  -- Should return 3
SELECT COUNT(*) FROM promotions;  -- Should return 1
```

### Frontend Verification
- Open browser DevTools → Network tab
- All API calls should go to http://localhost:3000/api/*
- All requests should return 200 status (after login)
- No external network calls should be made

## What Works 100% Offline

✅ **Authentication**: JWT tokens generated and validated locally  
✅ **All CRUD Operations**: Employees, Payroll, Corrections, Promotions  
✅ **Workflow Transitions**: DRAFT → APPROVED → FINALIZED  
✅ **Salary Calculations**: PF, ESI, TDS computed locally  
✅ **Job Profile History**: Full tracking with versioning  
✅ **Chatbot**: Stub responses without external AI  
✅ **PDF Generation**: Returns stub metadata (actual PDF can be added with local library)

## Zero External Dependencies

- ❌ No cloud services
- ❌ No email services
- ❌ No SMS gateways
- ❌ No external authentication (OAuth, SSO)
- ❌ No AI/LLM APIs
- ❌ No payment gateways
- ❌ No cloud storage

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in .env is correct
- Run: `npx prisma studio` to verify database connection

### Frontend shows "Network Error"
- Ensure backend is running on port 3000
- Check browser console for CORS errors
- Verify proxy config in `vite.config.ts`

### Authentication fails
- Check backend logs for JWT errors
- Clear localStorage: `localStorage.clear()` in browser console
- Try login again

### No data showing
- Run seed script: `npm run prisma db seed`
- Check database has data: `psql -U postgres -d hrms_payroll -c "SELECT * FROM employees;"`

## Sample Test Data

### Employees
- John Doe (EMP001) - Engineering - ₹80,000 basic
- Jane Smith (EMP002) - Marketing - ₹60,000 basic
- Bob Johnson (EMP003) - Sales - ₹50,000 basic

### Payroll Run
- November 2025 - DRAFT status
- 3 salary slips generated

### Pending Items
- 1 Promotion request (Bob Johnson)
- 1 Salary correction (John Doe)

## Next Steps for Production

After local testing succeeds:
1. Add real PDF generation (puppeteer/react-pdf)
2. Integrate actual LLM for chatbot
3. Add email notifications
4. Implement proper user management
5. Add role-based access control
6. Deploy to production environment

---

**Status**: ✅ **100% TESTABLE LOCALLY WITHOUT INTERNET**
