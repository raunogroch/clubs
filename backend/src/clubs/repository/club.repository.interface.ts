// Interfaz para acceso a datos de Club
import { Club } from '../schema/club.schema';
import { UpdateClubDto } from '../dto/update-club.dto';
import { CreateClubDto } from '../dto/create-club.dto';

export interface IClubRepository {
  findOneByName(name: string): Promise<Club | null>;
  create(createClubDto: CreateClubDto): Promise<Club>;
  findAllPopulated(): Promise<Club[]>;
  findById(id: string): Promise<Club | null>;
  updateById(id: string, updateClubDto: UpdateClubDto): Promise<Club | null>;
  deleteById(id: string): Promise<Club | null>;
}
