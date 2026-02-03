import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LevelsService } from './levels.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { Level } from './schemas/level.schema';

@Controller('levels')
export class LevelsController {
  constructor(private levelsService: LevelsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLevelDto: CreateLevelDto): Promise<Level> {
    return this.levelsService.create(createLevelDto);
  }

  @Get()
  async findAll(): Promise<Level[]> {
    return this.levelsService.findAll();
  }

  @Get('group/:groupId')
  async findByGroupId(
    @Param('groupId') groupId: string,
  ): Promise<Level | null> {
    return this.levelsService.findByGroupId(groupId);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Level> {
    return this.levelsService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLevelDto: UpdateLevelDto,
  ): Promise<Level> {
    return this.levelsService.update(id, updateLevelDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    return this.levelsService.delete(id);
  }

  @Delete('group/:groupId')
  @HttpCode(HttpStatus.OK)
  async deleteByGroupId(
    @Param('groupId') groupId: string,
  ): Promise<{ message: string }> {
    return this.levelsService.deleteByGroupId(groupId);
  }
}
