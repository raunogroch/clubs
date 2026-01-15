import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminGroupsService } from './admin-groups.service';
import { AdminGroupsController } from './admin-groups.controller';
import { AdminGroup, AdminGroupSchema } from './schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AdminGroup.name,
        schema: AdminGroupSchema,
      },
    ]),
  ],
  controllers: [AdminGroupsController],
  providers: [AdminGroupsService],
  exports: [AdminGroupsService],
})
export class AdminGroupsModule {}
