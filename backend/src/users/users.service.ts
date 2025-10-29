// Servicio para la gestión de usuarios
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Roles } from './enum/roles.enum';
import { CreateUserDto, UpdateUserDto } from './dto';
import type { IUserRepository } from './repository/user.repository.interface';
import { Inject } from '@nestjs/common';
import { UserValidatorService } from './user-validator.service';
import { UserPasswordService } from './user-password.service';
import { ImageService } from 'src/utils';
import { GroupsUserHelperService } from '../clubs/groups/groups-user-helper.service';

interface currentAuth {
  sub: string;
  role: string;
}

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: IUserRepository,
    private readonly userValidator: UserValidatorService,
    private readonly userImageService: ImageService,
    private readonly userPasswordService: UserPasswordService,
    private readonly groupsUserHelperService: GroupsUserHelperService,
  ) {}
  /**
   * Obtiene los clubes y grupos en los que el usuario está agregado
   */
  async getClubsAndGroupsByUser(userId: string) {
    // Busca los grupos donde el usuario es coach o athlete
    const groups = await this.groupsUserHelperService.findGroupsByUser(userId);
    // Agrupa los grupos por club
    const clubsMap = new Map();
    groups.forEach((group: any) => {
      const club = group.clubId;
      if (!club) return;
      if (!clubsMap.has(club._id.toString())) {
        clubsMap.set(club._id.toString(), { club, groups: [] });
      }
      clubsMap.get(club._id.toString()).groups.push(group);
    });
    // Devuelve un array de clubes con sus grupos correspondientes
    return Array.from(clubsMap.values());
  }

  folder = 'profile'; // Define la carpeta donde se guardaran las fotos de perfil

  /**
   * Crea un nuevo usuario si el username no existe previamente
   * SRP: validación, imagen y password delegados a servicios
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.userValidator.validateUniqueUsername(createUserDto.username);
    createUserDto.image = this.userImageService.processImage(
      this.folder,
      createUserDto.image,
    );
    createUserDto.password = await this.userPasswordService.hashPassword(
      createUserDto.password,
    );
    return this.userRepository.create(createUserDto);
  }

  /**
   * Crea un usuario con rol SUPERADMIN
   */
  async createSuperUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create(createUserDto);
  }

  /**
   * Busca un usuario por su username
   */
  async findOneByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneByUsername(username);
  }

  /**
   * Busca un usuario por su ID
   */
  async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  /**
   * Obtiene todos los usuarios
   */
  async findAll(
    requestingUser: currentAuth,
    page?: number,
    limit?: number,
    searchTerm?: string,
    role?: string,
  ) {
    const currentPage = page ?? 1;
    const itemsPerPage = limit ?? 0;

    // Obtener todos los usuarios
    let allUsers = await this.userRepository.findAll();

    // Filtrar por múltiples campos (si se proporciona searchTerm)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      allUsers = allUsers.filter(
        (u) =>
          u.name?.toLowerCase().includes(term) ||
          u.lastname?.toLowerCase().includes(term) ||
          u.ci?.toLowerCase().includes(term),
      );
    }

    // Filtrar por rol según el usuario que hace la solicitud
    let filteredUsers = this.filterByRole(allUsers, requestingUser);

    // Si se pasa un parámetro de rol, filtrar por ese rol
    if (role) {
      filteredUsers = filteredUsers.filter((user) => user.role === role);
    }

    // INVERTIR EL ORDEN - del último al primero
    const reversedUsers = [...filteredUsers].reverse();

    const total = reversedUsers.length;

    // Si no hay límite, devolver todos los resultados invertidos
    if (!itemsPerPage) {
      return reversedUsers;
    }

    // Paginación
    const skip = (currentPage - 1) * itemsPerPage;
    const data = reversedUsers.slice(skip, skip + itemsPerPage);

    return {
      data,
      total,
      page: currentPage,
      limit: itemsPerPage,
      totalPages: Math.ceil(total / itemsPerPage),
    };
  }

  /**
   * Busca un usuario por su ID
   */
  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  /**
   * Busca un usuario por su username
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneByUsername(username);
  }

  /**
   * Actualiza los datos de un usuario
   * SRP: imagen y password delegados a servicios
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    if (updateUserDto.password) {
      updateUserDto.password = await this.userPasswordService.hashPassword(
        updateUserDto.password,
      );
    }
    updateUserDto.image = this.userImageService.processImage(
      this.folder,
      updateUserDto.image,
    );
    return this.userRepository.updateById(id, updateUserDto);
  }

  /**
   * Elimina un usuario por su ID
   */
  async remove(id: string): Promise<User | null> {
    await this.userValidator.validateExistence(id);
    return this.userRepository.deleteById(id);
  }

  /**
   * Restaurar (reactivar) un usuario previamente desactivado
   */
  async restore(id: string): Promise<User | null> {
    await this.userValidator.validateExistence(id);
    return this.userRepository.updateById(id, { active: true } as User);
  }

  /**
   * Obtiene el perfil de un usuario por su ID
   */
  async profile(id: string): Promise<User> {
    const userExist = await this.findOneById(id);
    if (!userExist) throw new NotFoundException('El usuario no fue encontrado');
    return userExist;
  }

  /**
   * Filtra usuarios según el rol del usuario solicitante
   */
  private filterByRole(users: User[], requestingUser: currentAuth): User[] {
    // Excluir al propio usuario
    const filtered = users.filter((user) => user.id !== requestingUser.sub);

    // Si es SUPERADMIN, devolver todos (sin filtrar por active)
    if (requestingUser.role === Roles.SUPERADMIN) return filtered;

    // Para los demás roles, sólo devolver usuarios activos
    const activeOnly = filtered.filter((user) => user.active === true);

    switch (requestingUser.role) {
      case Roles.ADMIN:
        return activeOnly.filter((user) => user.role !== Roles.SUPERADMIN);
      case Roles.ASSISTANT:
        return activeOnly.filter((user) => user.role !== Roles.SUPERADMIN);
      case Roles.COACH:
        return activeOnly.filter((user) =>
          [Roles.PARENT, Roles.ATHLETE].includes(user.role as Roles),
        );
      case Roles.PARENT:
        return activeOnly.filter((user) => user.role === Roles.ATHLETE);
      default:
        return [];
    }
  }
}
