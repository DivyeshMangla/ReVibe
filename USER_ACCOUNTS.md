# User Accounts & System Guide

## Default Password for All Seed Accounts: **password123**
## Default Password for New Employees: **Welcome@123**

---

## 🎯 QUICK START: How to Add an Employee

### As HR:
1. Login at `http://localhost` with `hr@company.com` / `password123`
2. Click **"Add Employee"** button
3. Fill in the form (all fields required)
4. Submit → Alert shows the new employee's **email** and **default password (Welcome@123)**
5. Give these credentials to the employee

### As New Employee:
1. Go to `http://localhost`
2. Login with the email HR provided
3. Use password: **Welcome@123**
4. You now have an employee account!

---

## HR / Admin Account
**Email:** `hr@company.com`  
**Password:** `password123`  
**Role:** HR  
**Employee:** Alice Admin (HR001)  

**Can Do:**
- ✅ Add new employees
- ✅ View all leaves across company
- ✅ View all transfers
- ✅ Schedule trainings for anyone
- ✅ Manage all modules
- ✅ Override any decision

---

## Supervisor / Manager Account
**Email:** `supervisor@company.com`  
**Password:** `password123`  
**Role:** SUPERVISOR  
**Employee:** Bob Supervisor (SUP001)  

**Can Do:**
- ✅ View team members (John Doe, Jane Smith)
- ✅ Approve/Reject leave requests from team
- ✅ Create performance evaluations for team
- ✅ Submit ACRs for team members
- ❌ Cannot see other teams' data
- ❌ Cannot add employees

**Team Members:**
- John Doe (john.doe@company.com)
- Jane Smith (jane.smith@company.com)

---

## Employee Accounts

### Employee 1
**Email:** `john.doe@company.com`  
**Password:** `password123`  
**Role:** EMPLOYEE  
**Employee:** John Doe (EMP001)  
**Department:** Engineering  
**Supervisor:** Bob Supervisor  

**Can Do:**
- ✅ Apply for own leaves
- ✅ View own leave history
- ✅ View own training schedule
- ✅ View own performance evaluations
- ✅ View own salary slips
- ❌ Cannot approve anything
- ❌ Cannot see others' data

### Employee 2
**Email:** `jane.smith@company.com`  
**Password:** `password123`  
**Role:** EMPLOYEE  
**Employee:** Jane Smith (EMP002)  
**Department:** Engineering  
**Supervisor:** Bob Supervisor  

**Can Do:**
- Same as Employee 1

### Employee 3
**Email:** `bob.johnson@company.com`  
**Password:** `password123`  
**Role:** EMPLOYEE  
**Employee:** Bob Johnson (EMP003)  
**Department:** Sales  
**Supervisor:** None (reports to HR)  

**Can Do:**
- Same as Employee 1

---

## Payroll Admin Account
**Email:** `payroll@company.com`  
**Password:** `password123`  
**Role:** PAYROLL_ADMIN  
**Employee:** None (system user)  

**Can Do:**
- ✅ Create payroll runs
- ✅ Calculate salaries
- ✅ Approve and finalize payroll
- ✅ Generate salary slips
- ❌ Cannot conduct evaluations
- ❌ Cannot approve leaves

---

## Testing Scenarios

### Test 1: Employee Applies for Leave
1. Login as `john.doe@company.com`
2. Navigate to "My Leaves"
3. Click "Apply Leave"
4. System should auto-fill employee = John Doe (read-only)
5. Fill in dates and reason
6. Submit
7. Leave should be in PENDING status

### Test 2: Supervisor Approves Leave
1. Login as `supervisor@company.com`
2. Navigate to "Team Leaves"
3. Should see John's leave request
4. Should NOT see Bob Johnson's leaves (different team)
5. Click "Approve"
6. Leave status changes to APPROVED
7. John should receive notification

### Test 3: HR Views All Data
1. Login as `hr@company.com`
2. Navigate to "Leaves" (all leaves)
3. Should see leaves from ALL employees
4. Can approve/reject any leave
5. Can add new employees
6. Can access all modules

### Test 4: Payroll Admin Creates Run
1. Login as `payroll@company.com`
2. Navigate to "Payroll"
3. Click "Create New Run"
4. Select month/year
5. System creates run
6. Can calculate and finalize
7. Cannot access leave management

### Test 5: Employee Cannot See Others' Data
1. Login as `john.doe@company.com`
2. Try to navigate to "All Leaves" (should not exist)
3. Can only see "My Leaves"
4. Cannot see approval buttons
5. Cannot access admin functions

---

## Quick Login Commands

```bash
# HR Login
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@company.com","password":"password123"}'

# Supervisor Login
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"supervisor@company.com","password":"password123"}'

# Employee Login
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@company.com","password":"password123"}'

# Payroll Login
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"payroll@company.com","password":"password123"}'
```

---

## Expected JWT Payload

When user logs in, JWT should contain:
```json
{
  "email": "john.doe@company.com",
  "sub": "user-id-uuid",
  "role": "EMPLOYEE",
  "employeeId": "employee-id-uuid"
}
```

This allows backend to:
- Identify the user
- Check their role
- Link to their employee record
- Filter data based on permissions

---

## Next Steps

1. Update frontend to store role in auth state
2. Create role-based route protection
3. Update forms to auto-fill current user for employees
4. Filter data by role (e.g., supervisor sees only their team)
5. Hide/show UI elements based on role
6. Test all workflows with different roles
