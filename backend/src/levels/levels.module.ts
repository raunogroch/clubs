import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Level, LevelSchema } from './schemas/level.schema';
import { LevelsController } from './levels.controller';
import { LevelsService } from './levels.service';
import { LevelsRepository } from './repository/levels.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Level.name, schema: LevelSchema }]),
  ],
  controllers: [LevelsController],
  providers: [LevelsService, LevelsRepository],
  exports: [LevelsService, LevelsRepository],
})
export class LevelsModule {}
