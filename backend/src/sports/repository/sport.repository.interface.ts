// Interfaz para acceso a datos de Sport
import { Sport } from '../schemas/sport.schemas';
import { CreateSportDto } from '../dto/create-sport.dto';
import { UpdateSportDto } from '../dto/update-sport.dto';

export interface ISportRepository {
  findOneByName(name: string): Promise<Sport | null>;
  create(createSportDto: CreateSportDto): Promise<Sport>;
  findAllPaginated(
    skip: number,
    limit: number,
    name?: string,
  ): Promise<[Sport[], number]>;
  findById(id: string): Promise<Sport | null>;
  updateById(id: string, updateSportDto: UpdateSportDto): Promise<Sport | null>;
  deleteById(id: string): Promise<Sport | null>;
}
