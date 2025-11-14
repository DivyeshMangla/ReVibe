const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Check if data already exists
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log('Database already seeded, skipping...');
    return;
  }

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create HR admin employee and user
  const hrEmployee = await prisma.employee.create({
    data: {
      empCode: 'HR001',
      name: 'Alice Admin',
      email: 'hr@company.com',
      department: 'Human Resources',
      designation: 'HR Manager',
      hireDate: new Date('2020-01-01'),
      status: 'ACTIVE',
    },
  });

  await prisma.user.create({
    data: {
      email: 'hr@company.com',
      password: hashedPassword,
      name: 'Alice Admin',
      role: 'HR',
      employeeId: hrEmployee.id,
    },
  });

  // Create Supervisor employee and user
  const supervisorEmployee = await prisma.employee.create({
    data: {
      empCode: 'SUP001',
      name: 'Bob Supervisor',
      email: 'supervisor@company.com',
      department: 'Engineering',
      designation: 'Engineering Manager',
      hireDate: new Date('2021-01-01'),
      status: 'ACTIVE',
    },
  });

  await prisma.user.create({
    data: {
      email: 'supervisor@company.com',
      password: hashedPassword,
      name: 'Bob Supervisor',
      role: 'SUPERVISOR',
      employeeId: supervisorEmployee.id,
    },
  });

  // Create regular employees under supervisor
  const employee1 = await prisma.employee.create({
    data: {
      empCode: 'EMP001',
      name: 'John Doe',
      email: 'john.doe@company.com',
      department: 'Engineering',
      designation: 'Software Engineer',
      hireDate: new Date('2023-01-15'),
      status: 'ACTIVE',
      supervisorId: supervisorEmployee.id,
    },
  });

  await prisma.user.create({
    data: {
      email: 'john.doe@company.com',
      password: hashedPassword,
      name: 'John Doe',
      role: 'EMPLOYEE',
      employeeId: employee1.id,
    },
  });

  const employee2 = await prisma.employee.create({
    data: {
      empCode: 'EMP002',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      department: 'Engineering',
      designation: 'Senior Software Engineer',
      hireDate: new Date('2023-03-20'),
      status: 'ACTIVE',
      supervisorId: supervisorEmployee.id,
    },
  });

  await prisma.user.create({
    data: {
      email: 'jane.smith@company.com',
      password: hashedPassword,
      name: 'Jane Smith',
      role: 'EMPLOYEE',
      employeeId: employee2.id,
    },
  });

  const employee3 = await prisma.employee.create({
    data: {
      empCode: 'EMP003',
      name: 'Bob Johnson',
      email: 'bob.johnson@company.com',
      department: 'Sales',
      designation: 'Sales Executive',
      hireDate: new Date('2023-06-10'),
      status: 'ACTIVE',
    },
  });

  await prisma.user.create({
    data: {
      email: 'bob.johnson@company.com',
      password: hashedPassword,
      name: 'Bob Johnson',
      role: 'EMPLOYEE',
      employeeId: employee3.id,
    },
  });

  // Create Payroll Admin user (not employee)
  await prisma.user.create({
    data: {
      email: 'payroll@company.com',
      password: hashedPassword,
      name: 'Carol Payroll',
      role: 'PAYROLL_ADMIN',
    },
  });

  console.log('Created users and employees with roles');

  // Create job profiles
  await prisma.jobProfile.create({
    data: {
      employeeId: employee1.id,
      role: 'Senior Software Engineer',
      department: 'Engineering',
      responsibilities: 'Lead backend development, mentor junior developers',
      effectiveDate: new Date('2023-01-15'),
    },
  });

  await prisma.jobProfile.create({
    data: {
      employeeId: employee2.id,
      role: 'Marketing Manager',
      department: 'Marketing',
      responsibilities: 'Lead marketing campaigns, manage social media',
      effectiveDate: new Date('2023-03-20'),
    },
  });

  await prisma.jobProfile.create({
    data: {
      employeeId: employee3.id,
      role: 'Sales Representative',
      department: 'Sales',
      responsibilities: 'Generate leads, close deals, maintain client relationships',
      effectiveDate: new Date('2023-06-10'),
    },
  });

  console.log('Created job profiles');

  // Create a sample payroll run
  const payrollRun = await prisma.payrollRun.create({
    data: {
      month: 11,
      year: 2025,
      status: 'DRAFT',
      createdBy: 'admin',
    },
  });

  console.log('Created payroll run:', payrollRun);

  // Create salary slips
  await prisma.salarySlip.create({
    data: {
      employeeId: employee1.id,
      payrollRunId: payrollRun.id,
      basicSalary: 80000,
      hra: 32000,
      da: 9600,
      otherEarnings: 5000,
      pf: 9600,
      esi: 0,
      tds: 8000,
      otherDeductions: 0,
      grossSalary: 126600,
      netPay: 109000,
    },
  });

  await prisma.salarySlip.create({
    data: {
      employeeId: employee2.id,
      payrollRunId: payrollRun.id,
      basicSalary: 60000,
      hra: 24000,
      da: 7200,
      otherEarnings: 3000,
      pf: 7200,
      esi: 0,
      tds: 5000,
      otherDeductions: 0,
      grossSalary: 94200,
      netPay: 82000,
    },
  });

  await prisma.salarySlip.create({
    data: {
      employeeId: employee3.id,
      payrollRunId: payrollRun.id,
      basicSalary: 50000,
      hra: 20000,
      da: 6000,
      otherEarnings: 2000,
      pf: 6000,
      esi: 585,
      tds: 3000,
      otherDeductions: 0,
      grossSalary: 78000,
      netPay: 68415,
    },
  });

  console.log('Created salary slips');

  // Create a sample promotion
  await prisma.promotion.create({
    data: {
      employeeId: employee3.id,
      currentRole: 'Sales Representative',
      proposedRole: 'Senior Sales Representative',
      currentSalary: 50000,
      proposedSalary: 60000,
      salaryIncrease: 10000,
      reason: 'Exceeded sales targets for 3 consecutive quarters',
      status: 'PENDING',
      effectiveDate: new Date('2025-12-01'),
      requestedBy: 'manager',
    },
  });

  console.log('Created promotion');

  // Create a sample correction request
  const slip = await prisma.salarySlip.findFirst({
    where: { employeeId: employee1.id },
  });

  if (slip) {
    await prisma.correction.create({
      data: {
        salarySlipId: slip.id,
        requestedBy: employee1.id,
        reason: 'Missing performance bonus',
        changes: { otherEarnings: 10000 },
        status: 'PENDING',
      },
    });
    console.log('Created correction request');
  }

  // Create sample leaves
  await prisma.leave.create({
    data: {
      employeeId: employee1.id,
      leaveType: 'CASUAL',
      startDate: new Date('2025-12-01'),
      endDate: new Date('2025-12-03'),
      days: 3,
      reason: 'Family function',
      status: 'PENDING',
    },
  });

  await prisma.leave.create({
    data: {
      employeeId: employee2.id,
      leaveType: 'SICK',
      startDate: new Date('2025-11-20'),
      endDate: new Date('2025-11-22'),
      days: 3,
      reason: 'Medical checkup',
      status: 'APPROVED',
      approvedBy: 'manager',
      approvedAt: new Date(),
    },
  });

  console.log('Created leave requests');

  // Create sample training
  await prisma.training.create({
    data: {
      employeeId: employee1.id,
      trainingName: 'Advanced Node.js Development',
      trainingType: 'Technical',
      startDate: new Date('2025-12-10'),
      endDate: new Date('2025-12-14'),
      duration: 5,
      trainer: 'John Tech',
      status: 'SCHEDULED',
    },
  });

  await prisma.training.create({
    data: {
      employeeId: employee3.id,
      trainingName: 'Sales Excellence Program',
      trainingType: 'Soft Skills',
      startDate: new Date('2025-11-01'),
      endDate: new Date('2025-11-03'),
      duration: 3,
      trainer: 'Mary Sales',
      status: 'COMPLETED',
      completionDate: new Date('2025-11-03'),
      score: 85.5,
      feedback: 'Good performance',
    },
  });

  console.log('Created trainings');

  // Create sample ACR
  await prisma.aCR.create({
    data: {
      employeeId: employee1.id,
      year: 2025,
      reviewPeriod: 'Jan-Dec 2025',
      overallRating: 4.5,
      strengths: 'Excellent technical skills, good team player',
      improvements: 'Communication could be improved',
      goals: 'Lead a major project, mentor junior developers',
      reviewerName: 'Tech Manager',
      reviewerEmail: 'manager@company.com',
      status: 'SUBMITTED',
      submittedAt: new Date(),
    },
  });

  console.log('Created ACR');

  // Create sample evaluation
  await prisma.evaluation.create({
    data: {
      employeeId: employee2.id,
      evaluationType: 'Quarterly',
      period: 'Q3 2025',
      overallScore: 4.2,
      technicalScore: 4.0,
      softSkillScore: 4.5,
      punctuality: 5.0,
      teamwork: 4.3,
      comments: 'Consistently good performance',
      evaluatedBy: 'Marketing Head',
      status: 'APPROVED',
    },
  });

  console.log('Created evaluation');

  // Create sample transfer
  await prisma.transfer.create({
    data: {
      employeeId: employee3.id,
      fromDepartment: 'Sales',
      toDepartment: 'Marketing',
      fromLocation: 'Mumbai',
      toLocation: 'Delhi',
      reason: 'Career growth opportunity',
      effectiveDate: new Date('2026-01-01'),
      status: 'PENDING',
    },
  });

  console.log('Created transfer request');

  // Create sample joining/relieving
  await prisma.joiningRelieving.create({
    data: {
      employeeId: employee1.id,
      type: 'JOINING',
      effectiveDate: new Date('2023-01-15'),
      reason: 'New hire',
      clearanceStatus: 'COMPLETED',
      status: 'COMPLETED',
      approvedBy: 'HR Manager',
      approvedAt: new Date('2023-01-15'),
    },
  });

  console.log('Created joining record');

  // Create sample eService book entries
  await prisma.eServiceBook.create({
    data: {
      employeeId: employee1.id,
      entryType: 'Promotion',
      entryDate: new Date('2024-06-01'),
      description: 'Promoted to Senior Software Engineer',
      verifiedBy: 'HR',
      verifiedAt: new Date('2024-06-02'),
    },
  });

  await prisma.eServiceBook.create({
    data: {
      employeeId: employee2.id,
      entryType: 'Award',
      entryDate: new Date('2024-08-15'),
      description: 'Employee of the Month - August 2024',
      verifiedBy: 'HR',
      verifiedAt: new Date('2024-08-16'),
    },
  });

  console.log('Created eService book entries');

  // Create sample property returns
  await prisma.propertyReturn.create({
    data: {
      employeeId: employee1.id,
      itemName: 'Laptop - Dell XPS 15',
      itemCategory: 'IT Equipment',
      serialNumber: 'DELL123456',
      issuedDate: new Date('2023-01-20'),
      status: 'ISSUED',
    },
  });

  await prisma.propertyReturn.create({
    data: {
      employeeId: employee2.id,
      itemName: 'Office Mobile Phone',
      itemCategory: 'Communication',
      serialNumber: 'MOB789012',
      issuedDate: new Date('2023-04-01'),
      returnDate: new Date('2025-10-15'),
      condition: 'Good',
      status: 'RETURNED',
      submittedAt: new Date('2025-10-15'),
      verifiedBy: 'IT Admin',
      verifiedAt: new Date('2025-10-16'),
    },
  });

  console.log('Created property return records');

  console.log('Database seeded successfully with all modules!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
