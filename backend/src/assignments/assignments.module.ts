import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { Assignment, AssignmentSchema } from './schemas/assignment.schema';
import { AssignmentRepository } from './repository/assignment.repository';

/**
 * AssignmentsModule - Módulo de Asignaciones
 *
 * Gestiona la asignación de módulos a administradores
 * Solo accesible por el superadministrador
 *
 * Exports:
 * - AssignmentsService: Para usar en otros módulos
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Assignment.name, schema: AssignmentSchema },
    ]),
  ],
  controllers: [AssignmentsController],
  providers: [
    AssignmentsService,
    { provide: 'AssignmentRepository', useClass: AssignmentRepository },
    AssignmentRepository,
  ],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
