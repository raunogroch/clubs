// Interfaz para acceso a datos de Competency
import { Competency } from '../schemas/competency.schema';
import { CreateCompetencyDto } from '../dto/create-competency.dto';
import { UpdateCompetencyDto } from '../dto/update-competency.dto';

export interface ICompetencyRepository {
  findOneByName(name: string): Promise<Competency | null>;
  create(createCompetencyDto: CreateCompetencyDto): Promise<Competency>;
  findAllPopulated(): Promise<Competency[]>;
  findById(id: string): Promise<Competency | null>;
  updateById(
    id: string,
    updateCompetencyDto: UpdateCompetencyDto,
  ): Promise<Competency | null>;
  deleteById(id: string): Promise<Competency | null>;
}
