import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminGroupDto } from './create-admin-group.dto';

export class UpdateAdminGroupDto extends PartialType(CreateAdminGroupDto) {}
