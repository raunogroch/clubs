import { Module } from '@nestjs/common';
import { CompetenciesService } from './competencies.service';
import { CompetenciesController } from './competencies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Competency, CompetencySchema } from './schemas/competency.schema';
import { CompetencyRepository } from './repository/competency.repository';
import { CompetencyValidatorService } from './competency-validator.service';

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
  providers: [
    CompetenciesService,
    { provide: 'CompetencyRepository', useClass: CompetencyRepository },
    CompetencyValidatorService,
  ],
})
export class CompetenciesModule {}
