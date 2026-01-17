import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ManagementGroup } from './schema';
import { CreateManagementGroupDto, UpdateManagementGroupDto } from './dto';

@Injectable()
export class ManagementGroupsService {
  constructor(
    @InjectModel('ManagementGroup')
    private readonly adminGroupModel: Model<ManagementGroup>,
  ) {}

  async create(createManagementGroupDto: CreateManagementGroupDto): Promise<ManagementGroup> {
    const group = await this.adminGroupModel.create(createManagementGroupDto);
    return group.populate([
      'administrator',
      'coaches',
      'athletes',
      'clubs',
      'sports',
    ]);
  }

  async findAll(): Promise<ManagementGroup[]> {
    return this.adminGroupModel
      .find({ active: true })
      .populate(['administrator', 'coaches', 'athletes', 'clubs', 'sports'])
      .sort({ createdAt: -1 });
  }

  async findAllIncludeDeleted(): Promise<ManagementGroup[]> {
    return this.adminGroupModel
      .find()
      .populate(['administrator', 'coaches', 'athletes', 'clubs', 'sports'])
      .sort({ createdAt: -1 });
  }

  async findOne(id: string): Promise<ManagementGroup> {
    const group = await this.adminGroupModel
      .findById(id)
      .populate(['administrator', 'coaches', 'athletes', 'clubs', 'sports']);

    if (!group) {
      throw new NotFoundException(`Admin group with ID ${id} not found`);
    }

    return group;
  }

  async update(
    id: string,
    updateManagementGroupDto: UpdateManagementGroupDto,
  ): Promise<ManagementGroup> {
    const group = await this.adminGroupModel
      .findByIdAndUpdate(id, updateManagementGroupDto, { new: true })
      .populate(['administrator', 'coaches', 'athletes', 'clubs', 'sports']);

    if (!group) {
      throw new NotFoundException(`Admin group with ID ${id} not found`);
    }

    return group;
  }

  async remove(id: string): Promise<ManagementGroup> {
    // Soft delete
    const group = await this.adminGroupModel
      .findByIdAndUpdate(id, { active: false }, { new: true })
      .populate(['administrator', 'coaches', 'athletes', 'clubs', 'sports']);

    if (!group) {
      throw new NotFoundException(`Admin group with ID ${id} not found`);
    }

    return group;
  }

  async restore(id: string): Promise<ManagementGroup> {
    const group = await this.adminGroupModel
      .findByIdAndUpdate(id, { active: true }, { new: true })
      .populate(['administrator', 'coaches', 'athletes', 'clubs', 'sports']);

    if (!group) {
      throw new NotFoundException(`Admin group with ID ${id} not found`);
    }

    return group;
  }

  /**
   * Obtiene el grupo asignado a un administrador
   */
  async findByAdministrator(
    administratorId: string,
  ): Promise<ManagementGroup | null> {
    return this.adminGroupModel
      .findOne({ administrator: administratorId, active: true })
      .populate(['administrator', 'coaches', 'athletes', 'clubs', 'sports']);
  }
}
