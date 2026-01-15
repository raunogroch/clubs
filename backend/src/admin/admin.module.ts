import { Module } from '@nestjs/common';
import { AdminGroupsModule } from './admin-groups/admin-groups.module';

@Module({
  imports: [AdminGroupsModule],
  exports: [AdminGroupsModule],
})
export class AdminModule {}
