import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create employees
  const employee1 = await prisma.employee.create({
    data: {
      empCode: 'EMP001',
      name: 'John Doe',
      email: 'john.doe@company.com',
      department: 'Engineering',
      hireDate: new Date('2023-01-15'),
      status: 'ACTIVE',
    },
  });

  const employee2 = await prisma.employee.create({
    data: {
      empCode: 'EMP002',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      department: 'Marketing',
      hireDate: new Date('2023-03-20'),
      status: 'ACTIVE',
    },
  });

  const employee3 = await prisma.employee.create({
    data: {
      empCode: 'EMP003',
      name: 'Bob Johnson',
      email: 'bob.johnson@company.com',
      department: 'Sales',
      hireDate: new Date('2023-06-10'),
      status: 'ACTIVE',
    },
  });

  console.log('Created employees:', { employee1, employee2, employee3 });

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

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
