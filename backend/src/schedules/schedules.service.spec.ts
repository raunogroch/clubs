import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesService } from './schedules.service';
import { getModelToken } from '@nestjs/mongoose';
import { Schedule } from './schema/schedule.schema';

describe('SchedulesService', () => {
  let service: SchedulesService;

  const mockScheduleModel = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulesService,
        {
          provide: getModelToken(Schedule.name),
          useValue: mockScheduleModel,
        },
      ],
    }).compile();

    service = module.get<SchedulesService>(SchedulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
