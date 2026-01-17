import { PartialType } from '@nestjs/mapped-types';
import { CreateManagementGroupDto } from './create-management-group.dto';

export class UpdateManagementGroupDto extends PartialType(
  CreateManagementGroupDto,
) {}
