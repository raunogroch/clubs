import { Injectable } from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club } from './schema/club.schema';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class ClubsService {
  constructor(
    @InjectModel(Club.name) private clubModel: Model<Club>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createClubDto: CreateClubDto): Promise<Club> {
    const club = await this.clubModel.findOne({ name: createClubDto.name });
    if (club) {
      throw new Error('Club with this name already exists');
    }
    return this.clubModel.create(createClubDto);
  }

  async findAll(): Promise<Club[]> {
    return this.clubModel.find().populate([
      {
        path: 'schedule',
        select: 'startTime endTime',
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

  async findOne(id: string): Promise<Club | null> {
    return this.clubModel.findById(id);
  }

  async update(id: string, updateClubDto: UpdateClubDto): Promise<Club | null> {
    const clubExist: any = await this.clubModel.findById(id);
    if (!clubExist) throw new Error(`Club with id ${id} isn't exist`);

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
            console.log(`User with id ${coach} is not a coach`);
          }
        }),
      );

      updateClubDto.coaches = [...clubExist.coaches, ...allowedCoaches];
    }

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
            console.log(`User with id ${athlete} is not a coach`);
          }
        }),
      );

      updateClubDto.athletes = [...clubExist.athletes, ...allowedAthletes];
    }
    return this.clubModel.findByIdAndUpdate(id, updateClubDto, { new: true });
  }

  async remove(id: string): Promise<Club | null> {
    return this.clubModel.findByIdAndDelete(id).exec();
  }
}
