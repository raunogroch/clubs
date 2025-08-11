import { Module } from '@nestjs/common';
import { CompetenciesService } from './competencies.service';
import { CompetenciesController } from './competencies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Competency, CompetencySchema } from './schemas/competency.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Competency.name,
        schema: CompetencySchema,
      },
    ]),
  ],
  controllers: [CompetenciesController],
  providers: [CompetenciesService],
})
export class CompetenciesModule {}
