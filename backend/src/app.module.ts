import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employees.module';
import { JobProfilesModule } from './job-profiles/job-profiles.module';
import { PayrollModule } from './payroll/payroll.module';
import { SalaryCorrectionsModule } from './salary-corrections/salary-corrections.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ChatbotModule } from './chatbot/chatbot.module';

@Module({
  imports: [
    AuthModule,
    EmployeesModule,
    JobProfilesModule,
    PayrollModule,
    SalaryCorrectionsModule,
    PromotionsModule,
    ChatbotModule,
  ],
})
export class AppModule {}
