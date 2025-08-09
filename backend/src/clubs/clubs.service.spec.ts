import { Test, TestingModule } from '@nestjs/testing';
import { ClubsService } from './clubs.service';
import { getModelToken } from '@nestjs/mongoose';
import { Club } from './schema/club.schema';
import { Model, Types } from 'mongoose';
import { CreateClubDto } from './dto/create-club.dto';

const mockClubs = [
  {
    name: 'Fútbol Club Barcelona',
    schedule: {
      startTime: '18:00',
      endTime: '20:00',
    },
    place: 'Camp Nou',
    discipline: 'Fútbol',
    coaches: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    athletes: [
      '507f1f77bcf86cd799439013',
      '507f1f77bcf86cd799439014',
      '507f1f77bcf86cd799439015',
    ],
  },
  {
    name: 'Golden State Warriors',
    schedule: {
      startTime: '19:30',
      endTime: '21:30',
    },
    place: 'Chase Center',
    discipline: 'Baloncesto',
    coaches: ['507f1f77bcf86cd799439016'],
    athletes: [
      '507f1f77bcf86cd799439017',
      '507f1f77bcf86cd799439018',
      '507f1f77bcf86cd799439019',
    ],
  },
  {
    name: 'Nadal Tennis Academy',
    schedule: {
      startTime: '08:00',
      endTime: '10:00',
    },
    place: 'Mallorca',
    discipline: 'Tenis',
    coaches: ['507f1f77bcf86cd799439020'],
    athletes: ['507f1f77bcf86cd799439021', '507f1f77bcf86cd799439022'],
  },
  {
    name: 'NYC Marathon Club',
    schedule: {
      startTime: '06:00',
      endTime: '08:00',
    },
    place: 'Central Park',
    discipline: 'Atletismo',
    coaches: ['507f1f77bcf86cd799439023', '507f1f77bcf86cd799439024'],
    athletes: [
      '507f1f77bcf86cd799439025',
      '507f1f77bcf86cd799439026',
      '507f1f77bcf86cd799439027',
    ],
  },
  {
    name: 'Olympic Swimming Team',
    schedule: {
      startTime: '07:00',
      endTime: '09:00',
    },
    place: 'Olympic Pool',
    discipline: 'Natación',
    coaches: ['507f1f77bcf86cd799439028'],
    athletes: ['507f1f77bcf86cd799439029', '507f1f77bcf86cd799439030'],
  },
];

describe('ClubsService', () => {
  let service: ClubsService;
  let model: Model<Club>;

  const mockClubModel = {
    find: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubsService,
        {
          provide: getModelToken(Club.name),
          useValue: mockClubModel,
        },
      ],
    }).compile();

    service = module.get<ClubsService>(ClubsService);
    model = module.get<Model<Club>>(getModelToken(Club.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(model).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of clubs', async () => {
      mockClubModel.find.mockResolvedValue(mockClubs);

      const result = await service.findAll();
      expect(result).toEqual(mockClubs);
    });
  });

  describe('create', () => {
    it('should create a new club', async () => {
      const createClubDto: CreateClubDto = {
        name: 'New Club',
        schedule: { startTime: '10:00', endTime: '12:00' },
        place: 'New Place',
        discipline: 'New Discipline',
        coaches: [new Types.ObjectId('507f1f77bcf86cd799439031')],
        athletes: [new Types.ObjectId('507f1f77bcf86cd799439032')],
      };

      const mockCreatedClub = {
        ...createClubDto,
        _id: '507f1f77bcf86cd799439033',
      };

      mockClubModel.create.mockResolvedValueOnce(mockCreatedClub);

      const result = await service.create(createClubDto);
      expect(result).toEqual(mockCreatedClub);
      expect(mockClubModel.create).toHaveBeenCalledWith(createClubDto);
    });
  });
});
