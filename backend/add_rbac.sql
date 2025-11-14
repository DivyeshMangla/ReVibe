-- Create UserRole enum
CREATE TYPE "UserRole" AS ENUM ('EMPLOYEE', 'SUPERVISOR', 'HR', 'PAYROLL_ADMIN');

-- Create users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role "UserRole" NOT NULL DEFAULT 'EMPLOYEE',
    "employeeId" TEXT UNIQUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key to employees
ALTER TABLE users ADD CONSTRAINT users_employeeId_fkey 
  FOREIGN KEY ("employeeId") REFERENCES employees(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- Add designation and supervisor to employees
ALTER TABLE employees ADD COLUMN designation TEXT DEFAULT 'Employee';
ALTER TABLE employees ADD COLUMN "supervisorId" TEXT;
ALTER TABLE employees ADD CONSTRAINT employees_supervisorId_fkey 
  FOREIGN KEY ("supervisorId") REFERENCES employees(id) ON DELETE SET NULL ON UPDATE CASCADE;
