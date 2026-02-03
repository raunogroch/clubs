import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { LevelsRepository } from './repository/levels.repository';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { Level } from './schemas/level.schema';

@Injectable()
export class LevelsService {
  constructor(private levelsRepository: LevelsRepository) {}

  async create(createLevelDto: CreateLevelDto): Promise<Level> {
    // Validar que el grupo no tenga ya un nivel
    const existingLevel = await this.levelsRepository.findByGroupId(
      createLevelDto.group_id,
    );
    if (existingLevel) {
      throw new BadRequestException(`El grupo ya tiene un nivel asignado`);
    }

    if (createLevelDto.level_assignment) {
      createLevelDto.level_assignment.sort((a, b) => a.order - b.order);
    }

    return this.levelsRepository.create(createLevelDto);
  }

  async findAll(): Promise<Level[]> {
    return this.levelsRepository.findAll();
  }

  async findById(id: string): Promise<Level> {
    const level = await this.levelsRepository.findById(id);
    if (!level) {
      throw new NotFoundException(`Nivel con ID ${id} no encontrado`);
    }
    return level;
  }

  async findByGroupId(groupId: string): Promise<Level | null> {
    return this.levelsRepository.findByGroupId(groupId);
  }

  async update(id: string, updateLevelDto: UpdateLevelDto): Promise<Level> {
    if (updateLevelDto.level_assignment) {
      updateLevelDto.level_assignment.sort((a, b) => a.order - b.order);
    }

    const level = await this.levelsRepository.update(id, updateLevelDto);
    if (!level) {
      throw new NotFoundException(`Nivel con ID ${id} no encontrado`);
    }
    return level;
  }

  async delete(id: string): Promise<{ message: string }> {
    const level = await this.levelsRepository.delete(id);
    if (!level) {
      throw new NotFoundException(`Nivel con ID ${id} no encontrado`);
    }
    return { message: 'Nivel eliminado exitosamente' };
  }

  async deleteByGroupId(groupId: string): Promise<{ message: string }> {
    await this.levelsRepository.deleteByGroupId(groupId);
    return { message: 'Nivel del grupo eliminado exitosamente' };
  }
}
