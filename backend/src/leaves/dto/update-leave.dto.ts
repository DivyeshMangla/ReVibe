import { CreateLeaveDto } from './create-leave.dto';

export class UpdateLeaveDto implements Partial<CreateLeaveDto> {
  employeeId?: string;
  leaveType?: 'SICK' | 'CASUAL' | 'EARNED' | 'MATERNITY' | 'PATERNITY' | 'UNPAID';
  startDate?: string;
  endDate?: string;
  reason?: string;
}
