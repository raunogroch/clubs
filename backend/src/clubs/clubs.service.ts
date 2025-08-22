// Servicio para la gestión de clubes
import { Injectable } from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club } from './schema/club.schema';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class ClubsService {
  // Constructor con inyección de modelos Club y User
  constructor(
    @InjectModel(Club.name) private clubModel: Model<Club>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  /**
   * Crea un nuevo club si el nombre no existe previamente
   */
  async create(createClubDto: CreateClubDto): Promise<Club> {
    const club = await this.clubModel.findOne({ name: createClubDto.name });
    if (club) {
      throw new Error('Club with this name already exists');
    }
    return this.clubModel.create(createClubDto);
  }

  /**
   * Obtiene todos los clubes con sus relaciones pobladas
   */
  async findAll(): Promise<Club[]> {
    return this.clubModel.find().populate([
      {
        path: 'schedule',
        select: 'startTime endTime',
      },
      {
        path: 'discipline',
        select: 'name',
      },
      {
        path: 'coaches',
        select: 'name lastname',
      },
      {
        path: 'athletes',
        select: 'name lastname',
      },
    ]);
  }

  /**
   * Busca un club por su ID
   */
  async findOne(id: string): Promise<Club | null> {
    return this.clubModel.findById(id);
  }

  /**
   * Actualiza los datos de un club, validando coaches y atletas
   */
  async update(id: string, updateClubDto: UpdateClubDto): Promise<Club | null> {
    const clubExist: any = await this.clubModel.findById(id);
    if (!clubExist) throw new Error(`Club with id ${id} doesn't exist`);

    return this.clubModel.findByIdAndUpdate(id, updateClubDto, { new: true });
  }

  /**
   * Elimina un club por su ID
   */
  async remove(id: string): Promise<Club | null> {
    return this.clubModel.findByIdAndDelete(id).exec();
  }
}
