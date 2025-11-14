import { Module } from '@nestjs/common';
import { JobProfilesService } from './job-profiles.service';
import { JobProfilesController } from './job-profiles.controller';

@Module({
  controllers: [JobProfilesController],
  providers: [JobProfilesService],
  exports: [JobProfilesService],
})
export class JobProfilesModule {}
