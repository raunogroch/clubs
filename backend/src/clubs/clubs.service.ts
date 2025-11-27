import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Roles } from 'src/users/enum/roles.enum';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Club } from './schema/club.schema';
import { Inject } from '@nestjs/common';
import { ClubValidatorService } from './club-validator.service';
import { ImageService } from 'src/utils';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class ClubsService {
  constructor(
    @Inject('ClubRepository') private readonly clubRepository,
    private readonly clubValidator: ClubValidatorService,
    private readonly clubImageService: ImageService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  folder = 'clubs';

  async create(createClubDto: CreateClubDto): Promise<any> {
    let imageProcessingSkipped = false;
    try {
      createClubDto.images = await this.clubImageService.processImage(
        this.folder,
        (createClubDto as any).image,
      );
    } catch (error: any) {
      // If the image-processor service is unavailable, log and continue without images
      if (error && error.getStatus && error.getStatus() === 503) {
        console.warn(
          'Image processor service unavailable; creating club without images',
        );
      } else {
        throw error;
      }
    }
    await this.clubValidator.validateUniqueName(createClubDto.name);
    const created = await this.clubRepository.create(createClubDto);
    if (imageProcessingSkipped) {
      // Return object with extra flag to indicate image processing was skipped
      return {
        ...((created as any).toObject?.() ?? created),
        imageProcessingSkipped: true,
      };
    }
    return created;
  }

  async findAll(requestingUser?: {
    sub: string;
    role: string;
  }): Promise<Club[]> {
    let clubs: Club[] = await this.clubRepository.findAllPopulated();

    if (!requestingUser || requestingUser.role !== Roles.SUPERADMIN) {
      clubs = clubs.filter((c) => c.active === true);
    }

    if (requestingUser && requestingUser.role === Roles.ASSISTANT) {
      const userId = requestingUser.sub;
      clubs = clubs.filter((c: any) => {
        if (!c.assistants || c.assistants.length === 0) return false;
        return c.assistants.some((a: any) => {
          const aid = a?._id ? a._id.toString() : a?.toString();
          return aid === userId;
        });
      });
    }

    return clubs;
  }

  async assignAssistants(
    clubId: string,
    assistantIds: string[],
  ): Promise<Club | null> {
    const validUsers = await this.userModel.find({
      _id: { $in: assistantIds },
      role: Roles.ASSISTANT,
    });
    if (validUsers.length !== assistantIds.length) {
      throw new NotFoundException(
        'Algunos asistentes no existen o no tienen rol assistant',
      );
    }
    return this.clubRepository.updateById(clubId, {
      assistants: assistantIds,
    } as any);
  }

  async findOne(id: string): Promise<Club | null> {
    return this.clubRepository.findById(id);
  }

  async update(id: string, updateClubDto: UpdateClubDto): Promise<any | null> {
    let imageProcessingSkipped = false;
    if ((updateClubDto as any).image) {
      try {
        updateClubDto.images = await this.clubImageService.processImage(
          this.folder,
          (updateClubDto as any).image,
        );
      } catch (error: any) {
        if (error && error.getStatus && error.getStatus() === 503) {
          console.warn(
            'Image processor service unavailable; updating club without changing images',
          );
          imageProcessingSkipped = true;
        } else {
          throw error;
        }
      }
    }
    await this.clubValidator.validateExistence(id);
    const updated = await this.clubRepository.updateById(id, updateClubDto);
    if (!updated) return null;
    if (imageProcessingSkipped) {
      return {
        ...((updated as any).toObject?.() ?? updated),
        imageProcessingSkipped: true,
      };
    }
    return updated;
  }

  async remove(id: string): Promise<Club | null> {
    await this.clubValidator.validateExistence(id);

    await this.deleteAssociatedGroups(id);

    const club = await this.clubRepository.findById(id);
    if (!club) return null;

    await this.deleteClubImages(club);

    return await this.clubRepository.deleteById(id);
  }

  private async deleteAssociatedGroups(clubId: string): Promise<void> {
    const groupsService = this.userModel.db.model('Group');
    await groupsService.deleteMany({ clubId });
  }

  private async deleteClubImages(club: Club): Promise<void> {
    if (!club.images || !club.images.small) return;

    const folder = this.folder;
    const imagePath = club.images.small.replace('/images/clubs/', '');

    await this.clubImageService.deleteImage(folder, imagePath);
  }

  async restore(id: string): Promise<Club | null> {
    return this.clubRepository.updateById(id, { active: true } as Club);
  }

  async softRemove(id: string): Promise<Club | null> {
    await this.clubValidator.validateExistence(id);
    return this.clubRepository.updateById(id, { active: false } as Club);
  }
}
