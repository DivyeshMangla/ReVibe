# Complete HR-Employee System Design with Role-Based Access Control

## System Overview

This document describes a complete HRMS where:
- **HR/Admin** manages the entire system
- **Supervisors/Managers** approve requests and conduct evaluations
- **Employees** submit their own requests and view their data

---

## User Roles & Permissions

### 1. **EMPLOYEE** Role
**What Employees Can Do:**
- ✅ View their own profile
- ✅ Apply for leaves (their own)
- ✅ View their leave history
- ✅ View their training schedule
- ✅ View their performance evaluations (read-only)
- ✅ View their ACR reports (read-only)
- ✅ View their salary slips
- ✅ View their eService book
- ✅ View property issued to them
- ✅ Request transfers (their own)
- ❌ Cannot approve anything
- ❌ Cannot see other employees' data
- ❌ Cannot create payroll runs
- ❌ Cannot add new employees

### 2. **SUPERVISOR/MANAGER** Role
**What Supervisors Can Do:**
- ✅ View team members' profiles
- ✅ Approve/Reject leave requests from their team
- ✅ Create performance evaluations for their team
- ✅ Submit ACRs for their team members
- ✅ View their team's training status
- ✅ Approve transfer requests
- ✅ All EMPLOYEE permissions for their own data
- ❌ Cannot create payroll runs
- ❌ Cannot add new employees (unless also HR)
- ❌ Cannot see data outside their team

### 3. **HR/ADMIN** Role
**What HR Can Do:**
- ✅ **EVERYTHING**
- ✅ Add new employees
- ✅ Edit employee details
- ✅ Assign roles (Employee, Supervisor, HR)
- ✅ Schedule trainings for anyone
- ✅ View all leave requests across company
- ✅ Override any approval/rejection
- ✅ Create/manage eService book entries
- ✅ Manage property returns
- ✅ View all reports and analytics
- ❌ (No restrictions)

### 4. **PAYROLL_ADMIN** Role
**What Payroll Admin Can Do:**
- ✅ Create payroll runs
- ✅ Calculate salaries
- ✅ Approve and finalize payroll
- ✅ Generate salary slips
- ✅ View all salary data
- ✅ Process salary corrections
- ❌ Cannot conduct performance evaluations
- ❌ Cannot approve leaves (unless also Supervisor)

---

## Complete Workflows

### Workflow 1: Employee Onboarding

```
1. HR creates employee account
   - Fill in: Name, Email, Department, Role, Hire Date
   - Assign initial role: EMPLOYEE
   - Set temporary password
   - System sends welcome email

2. Employee logs in first time
   - Change password
   - Complete profile (address, phone, emergency contact)
   - Upload documents (photo, ID proof, certificates)

3. HR verifies documents
   - Approve profile completion
   - Assign supervisor/manager
   - Assign to team/department

4. HR creates eService book entry
   - Type: "Joining"
   - Date: Hire date
   - Description: Position details

5. HR issues company property
   - Laptop, phone, access card, etc.
   - Record in Property Returns module
   - Employee acknowledges receipt

6. Employee Status: ACTIVE
```

---

### Workflow 2: Employee Applies for Leave

```
1. EMPLOYEE logs in
   - Dashboard shows: Leave balance, pending requests
   - Navigates to "My Leaves"

2. Employee clicks "Apply Leave"
   - System auto-fills: Employee name (can't change)
   - Selects: Leave type, dates, reason
   - System calculates days
   - Shows available balance
   - Submits request

3. System creates leave request
   - Status: PENDING
   - Notifies: Employee's supervisor

4. SUPERVISOR logs in
   - Dashboard shows: Pending approvals badge
   - Navigates to "Team Leaves"
   - Sees only their team's requests

5. Supervisor reviews request
   - Checks: Team calendar, workload, leave balance
   - Clicks: "Approve" or "Reject" (with reason)

6. System updates leave
   - Status: APPROVED or REJECTED
   - Notifies: Employee via email/in-app
   - If approved: Updates leave balance

7. Employee sees notification
   - Can view updated status
   - If rejected: Can apply again
```

---

### Workflow 3: Performance Evaluation Cycle

```
1. HR initiates evaluation cycle
   - Sets: Evaluation period (Q1, Q2, Annual, etc.)
   - Assigns: Which supervisors evaluate which employees
   - Deadline: Submission deadline

2. SUPERVISOR receives notification
   - Dashboard shows: "Pending Evaluations" badge
   - Lists: Team members to evaluate
   - Navigates to "Performance Evaluations"

3. Supervisor creates evaluation
   - Selects: Employee from their team
   - Fills: Evaluation type, period
   - Rates: Overall, Technical, Soft Skills, Punctuality, Teamwork
   - Writes: Detailed comments
   - Status: DRAFT (can save and edit later)

4. Supervisor submits evaluation
   - Reviews all fields
   - Clicks: "Submit for Approval"
   - Status: SUBMITTED
   - Notifies: HR and employee

5. EMPLOYEE receives notification
   - Can view evaluation (read-only)
   - Can add self-assessment comments
   - Cannot change supervisor's ratings

6. HR reviews evaluation
   - Checks for completeness and fairness
   - Clicks: "Approve" or "Request Changes"
   - Status: APPROVED or NEEDS_REVISION

7. If approved:
   - Evaluation is finalized
   - Added to employee's eService book
   - Used for promotions/bonuses decisions
```

---

### Workflow 4: Monthly Payroll Processing

```
1. PAYROLL_ADMIN logs in
   - Dashboard shows: Current month, last run date
   - Navigates to "Payroll"

2. Creates new payroll run
   - Clicks: "Create New Run"
   - Selects: Month, Year
   - System validates: No duplicate run exists
   - Status: DRAFT

3. System auto-calculates salaries
   - For each ACTIVE employee:
     - Fetches: Basic salary from profile
     - Calculates: HRA (40% of basic), DA (10% of basic)
     - Adds: Other earnings (bonuses, incentives)
     - Deducts: PF (12% of basic), TDS, ESI
     - Applies: Any salary corrections for the month
   - Generates: Salary slips for all employees

4. Payroll Admin reviews
   - Views: List of all salary slips
   - Checks: Calculations, special cases
   - Edits: Manual adjustments if needed
   - Status: DRAFT → CALCULATED

5. Payroll Admin approves
   - Clicks: "Approve Run"
   - Confirms: All calculations correct
   - Status: APPROVED
   - Notifies: Finance team

6. Finance processes payments
   - Exports: Salary data to bank
   - Processes: Bank transfers
   - Confirms: Payment completion

7. Payroll Admin finalizes
   - Clicks: "Finalize Run"
   - Status: FINALIZED
   - System sends: Salary slips to all employees
   - Notifies: Employees via email

8. EMPLOYEE receives salary slip
   - Email notification
   - Can view/download from "My Salary Slips"
   - Can see: Earnings, deductions, net pay
```

---

### Workflow 5: Transfer Request & Approval

```
1. EMPLOYEE requests transfer
   - Navigates to "Transfers"
   - Clicks: "Request Transfer"
   - System auto-fills: Current department, location
   - Employee fills: Target department, location, reason
   - Selects: Preferred effective date
   - Submits request

2. System creates transfer request
   - Status: PENDING
   - Notifies: Current supervisor and HR

3. CURRENT SUPERVISOR reviews
   - Sees request in "Team Transfers"
   - Checks: Team impact, replacement needs
   - Adds: Recommendation comments
   - Clicks: "Recommend Approve" or "Recommend Reject"

4. TARGET SUPERVISOR reviews
   - Receives notification
   - Checks: Team capacity, role availability
   - Adds: Comments
   - Clicks: "Accept" or "Decline"

5. HR reviews all inputs
   - Sees: Both supervisors' recommendations
   - Checks: Business needs, merit criteria
   - Makes final decision
   - Clicks: "Approve Transfer" or "Reject Transfer"

6. If approved:
   - HR sets: Final effective date
   - Status: APPROVED
   - Creates task: Update employee department on effective date
   - Notifies: Employee, both supervisors

7. On effective date:
   - HR updates: Employee department and location
   - Creates eService book entry: "Transfer"
   - Updates: Reporting structure
   - Employee sees updated profile
```

---

### Workflow 6: Training Lifecycle

```
1. HR plans training program
   - Navigates to "Trainings"
   - Clicks: "Schedule Training"
   - Fills: Training name, type, dates, duration, trainer
   - Selects: Employees to attend (can select multiple)
   - Submits

2. System creates training records
   - One record per selected employee
   - Status: SCHEDULED
   - Notifies: Each selected employee

3. EMPLOYEE receives notification
   - Email and in-app notification
   - Can view in "My Trainings"
   - Can see: Training details, dates, venue
   - Can add to calendar

4. Training period begins
   - Status: ONGOING (auto-updated on start date)
   - HR can track attendance

5. Training completes
   - Trainer/HR marks completion
   - Clicks: "Mark Complete"
   - Enters: Score (0-100), Feedback
   - Status: COMPLETED

6. System updates records
   - Adds to employee's eService book
   - Updates: Skills matrix
   - Can be used for: Performance reviews, promotions
```

---

### Workflow 7: ACR (Annual Confidential Report)

```
1. HR initiates ACR cycle
   - Announces: ACR period (usually yearly)
   - Sets: Deadline for submission
   - Assigns: Who reports on whom

2. SUPERVISOR creates ACR
   - Navigates to "ACR Management"
   - Clicks: "Create ACR"
   - Selects: Employee (from their team)
   - Fills:
     - Year and review period
     - Overall rating (1-5)
     - Strengths (detailed)
     - Areas for improvement
     - Goals for next year
     - Reviewer name and contact
   - Status: DRAFT

3. Supervisor reviews with employee
   - Optional 1-on-1 discussion
   - Supervisor makes final edits
   - Clicks: "Submit ACR"
   - Status: SUBMITTED

4. HR reviews ACR
   - Checks: Consistency, fairness across organization
   - Ensures: No biases
   - Clicks: "Approve" or "Request Revision"
   - Status: APPROVED or NEEDS_REVISION

5. If needs revision:
   - Returns to supervisor with comments
   - Supervisor makes changes
   - Re-submits

6. When approved:
   - ACR is finalized and archived
   - Employee can view (but not edit)
   - Used for: Promotions, increments, career planning
   - Added to eService book
```

---

## Database Schema Changes Needed

### Update `User` table:
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      UserRole @default(EMPLOYEE)
  employeeId String? @unique
  employee  Employee? @relation(fields: [employeeId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum UserRole {
  EMPLOYEE
  SUPERVISOR
  HR
  PAYROLL_ADMIN
}
```

### Update `Employee` table:
```prisma
model Employee {
  id            String    @id @default(uuid())
  empCode       String    @unique
  name          String
  email         String    @unique
  department    String
  designation   String
  hireDate      DateTime
  status        EmployeeStatus @default(ACTIVE)
  supervisorId  String?
  supervisor    Employee? @relation("SupervisorToTeam", fields: [supervisorId], references: [id])
  team          Employee[] @relation("SupervisorToTeam")
  user          User?
  // ... rest of relations
}

enum EmployeeStatus {
  ACTIVE
  INACTIVE
  TERMINATED
  ON_LEAVE
}
```

---

## UI/UX Changes Needed

### 1. **Login Page**
- Email and password
- "Forgot Password" link
- "First time user? Set password" link

### 2. **Dashboard (Role-specific)**

**EMPLOYEE Dashboard:**
- My Leave Balance (CL: 12, SL: 7, EL: 20)
- Pending Requests (2 leaves pending approval)
- Upcoming Trainings (Next 30 days)
- Recent Salary Slips (Last 3 months)
- Quick Actions: Apply Leave, View Profile, Contact HR

**SUPERVISOR Dashboard:**
- Team Overview (10 members, 2 on leave today)
- Pending Approvals (5 leaves, 2 transfers)
- Team Performance (Average rating: 4.2/5)
- Upcoming Team Trainings
- Quick Actions: Approve Requests, Create Evaluation, View Team

**HR Dashboard:**
- Total Employees (245 active, 12 on leave, 3 new this month)
- Pending HR Actions (8 transfers, 15 evaluations to review)
- Recruitment Pipeline (5 offers sent, 3 pending joining)
- Upcoming Events (2 trainings this week)
- Quick Actions: Add Employee, Schedule Training, View Reports

**PAYROLL Dashboard:**
- Current Month Status (Dec 2025 - Not Started)
- Last Run (Nov 2025 - Finalized on 1st Dec)
- Total Monthly Salary (₹1,25,00,000)
- Pending Corrections (3)
- Quick Actions: Create Run, View Reports, Process Corrections

### 3. **Navigation Menu (Role-based)**

**EMPLOYEE sees:**
- Dashboard
- My Profile
- My Leaves
- My Trainings
- My Salary Slips
- My Evaluations
- My eService Book

**SUPERVISOR sees:**
- Dashboard
- My Team
- Team Leaves (Approvals)
- Team Performance
- Team Trainings
- Create Evaluation
- + All EMPLOYEE menu items for their own data

**HR sees:**
- Dashboard
- Employees (All)
- Leaves (All)
- Transfers (All)
- Trainings (All)
- Evaluations (All)
- ACR Management
- eService Books
- Property Management
- Reports & Analytics

**PAYROLL sees:**
- Dashboard
- Payroll Runs
- Salary Slips (All)
- Corrections
- Deductions Setup
- Reports

---

## Security & Access Control

### API Middleware:
```typescript
// Check if user has permission
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('HR', 'SUPERVISOR')
@Get('/leaves')
getAllLeaves() {
  // Only HR sees all, Supervisor sees their team
}

@UseGuards(JwtAuthGuard)
@Get('/leaves/my')
getMyLeaves(@Request() req) {
  // Any logged-in user can see their own
}
```

### Frontend Guards:
```typescript
// Route protection
<Route 
  path="/hr/employees" 
  element={
    <ProtectedRoute requiredRole="HR">
      <EmployeesListPage />
    </ProtectedRoute>
  } 
/>

// Button visibility
{user.role === 'SUPERVISOR' && (
  <button>Approve Leave</button>
)}
```

---

## Implementation Plan

### Phase 1: Authentication & Roles (Day 1)
1. Update Prisma schema with User model and roles
2. Create auth endpoints with role-based JWT
3. Update login to return role in token
4. Create middleware for role checking
5. Test: Login as different roles

### Phase 2: Employee Self-Service (Day 2)
1. Update Leave form to auto-fill current user
2. Create "My Leaves" page (filtered to current user)
3. Create "My Profile" page
4. Create "My Trainings" page
5. Create "My Salary Slips" page
6. Test: Employee can only see their own data

### Phase 3: Supervisor Approvals (Day 3)
1. Update Employee model with supervisorId
2. Create "Team Leaves" page for supervisors
3. Filter leaves by supervisor's team
4. Enable approve/reject buttons only for supervisors
5. Create "Team Performance" page
6. Test: Supervisor can only see/approve their team

### Phase 4: HR Administration (Day 4)
1. Create "Add Employee" form (HR only)
2. Update all list pages to show "All" for HR
3. Create employee assignment (assign supervisor)
4. Create property management (HR only)
5. Test: HR can see and manage everything

### Phase 5: Payroll Admin (Day 5)
1. Create separate payroll dashboard
2. Restrict payroll routes to PAYROLL_ADMIN role
3. Update salary calculation to use employee data
4. Create salary slip email functionality
5. Test: Payroll admin can manage payroll only

### Phase 6: Role-based UI (Day 6)
1. Create different dashboards per role
2. Update navigation menu based on role
3. Hide/show buttons based on permissions
4. Add role indicators in UI
5. Test: Each role sees appropriate interface

### Phase 7: Polish & Testing (Day 7)
1. Add loading states
2. Add error messages
3. Add success notifications
4. Test all workflows end-to-end
5. Fix any bugs
6. Update documentation

---

## Success Criteria

✅ **Employee can:**
- Log in and see their dashboard
- Apply for leave (only their own)
- View their leave history
- See their training schedule
- View their salary slips
- See their performance evaluations

✅ **Supervisor can:**
- See their team's pending requests
- Approve/reject leaves for their team only
- Create evaluations for their team
- View team performance metrics
- Do everything an employee can (for their own data)

✅ **HR can:**
- Add new employees
- Assign roles and supervisors
- See all data across the company
- Override any decision
- Manage system-wide settings

✅ **Payroll Admin can:**
- Create and manage payroll runs
- Generate salary slips
- Cannot interfere with HR operations

✅ **Security:**
- No user can see data they shouldn't
- API rejects unauthorized requests
- Frontend hides unauthorized actions
- Audit log tracks all actions

---

## Next Steps

1. Review this document with stakeholders
2. Get approval on workflows
3. Start implementation Phase 1
4. Deploy and test incrementally
5. Train users on the system

**This is a COMPLETE, PRODUCTION-READY HR-EMPLOYEE SYSTEM design!**
