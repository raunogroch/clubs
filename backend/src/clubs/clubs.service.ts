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

    // Validación y actualización de coaches
    if (updateClubDto.coaches) {
      const allowedCoaches: any[] = [];
      await Promise.all(
        updateClubDto.coaches.map(async (coach) => {
          const user = await this.userModel.findOne({
            _id: coach,
            roles: 'coach',
          });
          if (user) {
            const isAlreadyAdded: boolean = clubExist.coaches.includes(coach);
            if (!isAlreadyAdded) {
              allowedCoaches.push(coach);
            }
          } else {
            // Mensaje de advertencia si el usuario no es coach
            console.warn(`User with id ${coach} is not a coach`);
          }
        }),
      );
      // Se actualiza la lista de coaches agregando los nuevos válidos
      updateClubDto.coaches = [...clubExist.coaches, ...allowedCoaches];
    }

    // Validación y actualización de atletas
    if (updateClubDto.athletes) {
      const allowedAthletes: any[] = [];
      await Promise.all(
        updateClubDto.athletes.map(async (athlete) => {
          const user = await this.userModel.findOne({
            _id: athlete,
            roles: 'athlete',
          });
          if (user) {
            const isAlreadyAdded: boolean =
              clubExist.athletes.includes(athlete);
            if (!isAlreadyAdded) {
              allowedAthletes.push(athlete);
            }
          } else {
            // Mensaje de advertencia si el usuario no es atleta
            console.warn(`User with id ${athlete} is not an athlete`);
          }
        }),
      );
      // Se actualiza la lista de atletas agregando los nuevos válidos
      updateClubDto.athletes = [...clubExist.athletes, ...allowedAthletes];
    }
    // Actualiza el club en la base de datos y retorna el resultado
    return this.clubModel.findByIdAndUpdate(id, updateClubDto, { new: true });
  }

  /**
   * Elimina un club por su ID
   */
  async remove(id: string): Promise<Club | null> {
    return this.clubModel.findByIdAndDelete(id).exec();
  }
}
