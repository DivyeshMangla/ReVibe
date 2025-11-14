import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employees.module';
import { JobProfilesModule } from './job-profiles/job-profiles.module';
import { PayrollModule } from './payroll/payroll.module';
import { SalaryCorrectionsModule } from './salary-corrections/salary-corrections.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { HealthModule } from './health/health.module';

import { LeavesModule } from './leaves/leaves.module';
import { TransfersModule } from './transfers/transfers.module';
import { TrainingsModule } from './trainings/trainings.module';
import { AcrsModule } from './acrs/acrs.module';
import { EvaluationsModule } from './evaluations/evaluations.module';

@Module({
  imports: [
    AuthModule,
    EmployeesModule,
    JobProfilesModule,
    PayrollModule,
    SalaryCorrectionsModule,
    PromotionsModule,
    ChatbotModule,
    HealthModule,
    LeavesModule,
    TransfersModule,
    TrainingsModule,
    AcrsModule,
    EvaluationsModule,
  ],
})
export class AppModule {}
