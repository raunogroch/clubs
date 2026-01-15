import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminGroup } from './schema';
import { CreateAdminGroupDto, UpdateAdminGroupDto } from './dto';

@Injectable()
export class AdminGroupsService {
  constructor(
    @InjectModel('AdminGroup')
    private readonly adminGroupModel: Model<AdminGroup>,
  ) {}

  async create(createAdminGroupDto: CreateAdminGroupDto): Promise<AdminGroup> {
    const group = await this.adminGroupModel.create(createAdminGroupDto);
    return group.populate(['coaches', 'athletes']);
  }

  async findAll(): Promise<AdminGroup[]> {
    return this.adminGroupModel
      .find({ active: true })
      .populate(['coaches', 'athletes'])
      .sort({ createdAt: -1 });
  }

  async findAllIncludeDeleted(): Promise<AdminGroup[]> {
    return this.adminGroupModel
      .find()
      .populate(['coaches', 'athletes'])
      .sort({ createdAt: -1 });
  }

  async findOne(id: string): Promise<AdminGroup> {
    const group = await this.adminGroupModel
      .findById(id)
      .populate(['coaches', 'athletes']);

    if (!group) {
      throw new NotFoundException(`Admin group with ID ${id} not found`);
    }

    return group;
  }

  async update(
    id: string,
    updateAdminGroupDto: UpdateAdminGroupDto,
  ): Promise<AdminGroup> {
    const group = await this.adminGroupModel
      .findByIdAndUpdate(id, updateAdminGroupDto, { new: true })
      .populate(['coaches', 'athletes']);

    if (!group) {
      throw new NotFoundException(`Admin group with ID ${id} not found`);
    }

    return group;
  }

  async remove(id: string): Promise<AdminGroup> {
    // Soft delete
    const group = await this.adminGroupModel
      .findByIdAndUpdate(id, { active: false }, { new: true })
      .populate(['coaches', 'athletes']);

    if (!group) {
      throw new NotFoundException(`Admin group with ID ${id} not found`);
    }

    return group;
  }

  async restore(id: string): Promise<AdminGroup> {
    const group = await this.adminGroupModel
      .findByIdAndUpdate(id, { active: true }, { new: true })
      .populate(['coaches', 'athletes']);

    if (!group) {
      throw new NotFoundException(`Admin group with ID ${id} not found`);
    }

    return group;
  }
}
