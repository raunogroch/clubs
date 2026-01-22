/**
 * UsersService - Servicio de Gestión de Usuarios
 *
 * Responsabilidades principales:
 * - CRUD de usuarios (Create, Read, Update, Delete)
 * - Validación de datos según el rol del usuario
 * - Generación automática de credenciales para atletas
 * - Filtrado de usuarios según el rol del usuario autenticado
 * - Gestión de soft delete (inactivar usuarios)
 *
 * Roles soportados:
 * - SUPERADMIN: Acceso total a todos los usuarios
 * - ADMIN: Puede gestionar todos excepto superadmins
 * - ASSISTANT: Puede gestionar padres y atletas
 * - COACH: Solo puede ver padres y atletas
 * - ATHLETE: Usuario individual
 * - PARENT: Tutor/Apoderado
 *
 * Patrones utilizados:
 * - Repository Pattern: Para abstracción de datos
 * - Dependency Injection: Servicios inyectados en constructor
 */

import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from './schemas/user.schema';
import { Roles } from './enum/roles.enum';
import { CreateUserDto, UpdateUserDto } from './dto';
import type { IUserRepository } from './repository/user.repository.interface';
import { Inject } from '@nestjs/common';
import { UserValidatorService } from './user-validator.service';
import { UserPasswordService } from './user-password.service';
import { AssignmentsService } from '../assignments/assignments.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group } from '../clubs/schemas/group.schema';

/**
 * Interfaz para el usuario autenticado extraído del JWT
 * Se usa en métodos para filtrar datos según el rol del usuario
 */
interface currentAuth {
  sub: string; // ID del usuario
  role: string; // Rol del usuario
}

@Injectable()
export class UsersService {
  /**
   * Constructor con inyección de dependencias
   * @param userRepository - Repositorio para acceder a datos de usuarios
   * @param userValidator - Servicio para validar usuarios
   * @param userPasswordService - Servicio para hashear contraseñas
   * @param configService - Servicio de configuración
   */
  constructor(
    @Inject('UserRepository') private readonly userRepository: IUserRepository,
    private readonly userValidator: UserValidatorService,
    private readonly userPasswordService: UserPasswordService,
    private readonly assignmentsService: AssignmentsService,
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
    private readonly configService: ConfigService,
  ) {}

  /** Carpeta donde se almacenan las fotos de perfil de usuarios */
  folder = 'profile';

  /**
   * Valida que los campos requeridos según el rol estén presentes
   * Cada rol tiene requisitos diferentes:
   * - ATHLETE y PARENT: Solo requieren nombre y apellido
   * - COACH, ASSISTANT, ADMIN, SUPERADMIN: Requieren username, password, nombre y apellido
   *
   * @param createUserDto - Datos del usuario a validar
   * @throws Error si faltan campos requeridos
   */
  private validateRequiredFieldsByRole(createUserDto: CreateUserDto): void {
    const role = createUserDto.role;
    const errors: string[] = [];

    /**
     * Definir los campos requeridos para cada rol
     * Esto es un lookup que hace el código más mantenible
     */
    const requiredFields: Record<Roles, string[]> = {
      [Roles.ATHLETE]: ['name', 'lastname'],
      [Roles.PARENT]: ['name', 'lastname'],
      [Roles.COACH]: ['username', 'password', 'name', 'lastname'],
      [Roles.ASSISTANT]: ['username', 'password', 'name', 'lastname'],
      [Roles.ADMIN]: ['name', 'lastname', 'ci'],
      [Roles.SUPERADMIN]: ['username', 'password', 'name', 'lastname'],
    };

    // Obtener los campos requeridos para el rol del usuario
    const required = requiredFields[role] || [];

    // Validar que todos los campos requeridos estén presentes
    for (const field of required) {
      if (!createUserDto[field]) {
        errors.push(`Field '${field}' is required for role '${role}'`);
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join('; '));
    }
  }

  /**
   * Crea un nuevo usuario si el username no existe previamente
   * SRP: validación, imagen y password delegados a servicios
   */
  async create(createUserDto: CreateUserDto): Promise<any> {
    // Validar campos requeridos según el rol
    this.validateRequiredFieldsByRole(createUserDto);

    // Para ATHLETE sin username, generar automáticamente
    if (createUserDto.role === Roles.ATHLETE && !createUserDto.username) {
      const baseUsername = `${createUserDto.name?.toLowerCase() || 'athlete'}.${
        createUserDto.lastname?.toLowerCase() || 'user'
      }`.replace(/\s+/g, '');
      let username = baseUsername;
      let counter = 1;

      // Asegurar que el username sea único
      while (await this.userValidator.usernameExists(username)) {
        username = `${baseUsername}${counter}`;
        counter++;
      }
      createUserDto.username = username;
    }

    // Para ATHLETE sin password, generar automáticamente
    if (createUserDto.role === Roles.ATHLETE && !createUserDto.password) {
      createUserDto.password =
        Math.random().toString(36).substring(2, 10) +
        Math.random().toString(36).substring(2, 10);
    }

    // Para ADMIN, generar username y password automáticamente
    if (createUserDto.role === Roles.ADMIN) {
      // Generar username de estructura: firstname.lastname
      const firstName =
        createUserDto.name?.toLowerCase().split(' ')[0] || 'admin';
      const lastName =
        createUserDto.lastname?.toLowerCase().split(' ')[0] || 'user';
      const baseUsername = `${firstName}.${lastName}`;
      let username = baseUsername;
      let counter = 1;

      // Asegurar que el username sea único
      while (await this.userValidator.usernameExists(username)) {
        username = `${baseUsername}${counter}`;
        counter++;
      }
      createUserDto.username = username;

      // Usar CI como password
      createUserDto.password = createUserDto.ci;
    }

    // Validar username único solo si el rol requiere username
    if (createUserDto.username) {
      await this.userValidator.validateUniqueUsername(createUserDto.username);
    }

    let imageProcessingSkipped = false;

    // Procesar imagen solo si el rol la requiere y se proporciona
    // SIMPLIFICADO: Imagen processing removida
    /*
    if (
      [
        Roles.ATHLETE,
        Roles.COACH,
        Roles.ASSISTANT,
        Roles.ADMIN,
        Roles.SUPERADMIN,
      ].includes(createUserDto.role) &&
      createUserDto.image
    ) {
      try {
        createUserDto.images = (await this.userImageService.processImage(
          this.folder,
          createUserDto.image,
        )) as { small: string; medium: string; large: string };
      } catch (error: any) {
        if (error && error.getStatus && error.getStatus() === 503) {
          console.warn(
            'Image processor service unavailable; creating user without images',
          );
          imageProcessingSkipped = true;
        } else {
          throw error;
        }
      }
    }
    */

    // Hashear contraseña solo si el rol la requiere
    if (createUserDto.password) {
      createUserDto.password = await this.userPasswordService.hashPassword(
        createUserDto.password,
      );
    }

    const created = await this.userRepository.create(createUserDto);
    return created;
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
  async update(id: string, updateUserDto: UpdateUserDto): Promise<any | null> {
    if (updateUserDto.password) {
      updateUserDto.password = await this.userPasswordService.hashPassword(
        updateUserDto.password,
      );
    }
    /*
    let imageProcessingSkipped = false;
    try {
      updateUserDto.images = await this.userImageService.processImage(
        this.folder,
        updateUserDto.image,
      );
    } catch (error: any) {
      if (error && error.getStatus && error.getStatus() === 503) {
        console.warn(
          'Image processor service unavailable; updating user without changing images',
        );
        imageProcessingSkipped = true;
      } else {
        throw error;
      }
    }
    */
    const updated = await this.userRepository.updateById(id, updateUserDto);
    if (!updated) return null;
    /*
    if (imageProcessingSkipped) {
      return {
        ...((updated as any).toObject?.() ?? updated),
        imageProcessingSkipped: true,
      };
    }
    */
    return updated;
  }

  /**
   * Elimina un usuario por su ID
   */
  async remove(id: string): Promise<User | null> {
    await this.userValidator.validateExistence(id);
    return this.userRepository.deleteById(id);
  }

  /**
   * Marca un usuario como inactivo (soft delete)
   */
  async softRemove(id: string): Promise<User | null> {
    await this.userValidator.validateExistence(id);
    return this.userRepository.updateById(id, { active: false } as User);
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
   * Busca un usuario atleta por CI
   */
  async findByCi(ci: string): Promise<User | null> {
    const user = await this.userRepository.findByCi(ci);
    return user || null;
  }

  async findByCiByRole(ci: string, role?: string): Promise<User | null> {
    const user = await this.userRepository.findByCiByRole(ci, role);
    return user || null;
  }

  /**
   * Obtiene múltiples usuarios por sus IDs
   */
  async findByIds(ids: string[]): Promise<User[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    const users = await this.userRepository.findByIds(ids);
    return users || [];
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

  /**
   * Obtiene coaches únicos desde todos los grupos del assignment del admin
   * @param requestingUser - Usuario que hace la solicitud
   * @returns Array de coaches únicos sin duplicados
   */
  async getCoachesFromGroups(requestingUser: currentAuth): Promise<any[]> {
    try {
      // Obtener assignments del admin
      const adminAssignments =
        await this.assignmentsService.getAssignmentsByAdmin(requestingUser.sub);

      if (!adminAssignments || adminAssignments.length === 0) {
        return [];
      }

      // Obtener todos los clubes del primer assignment (o todos los clubes si hay múltiples)
      const clubIds = adminAssignments[0]?.clubs || [];

      if (!clubIds || clubIds.length === 0) {
        return [];
      }

      // Obtener todos los grupos de esos clubes
      const groups = await this.groupModel
        .find({ club_id: { $in: clubIds } })
        .populate('coaches')
        .exec();

      // Extraer coaches únicos
      const uniqueCoachIds = new Set<string>();
      const coachesMap = new Map<string, User>();

      for (const group of groups) {
        if (group.coaches && Array.isArray(group.coaches)) {
          for (const coach of group.coaches) {
            if (coach && (coach as any)._id) {
              const coachId = (coach as any)._id.toString();
              uniqueCoachIds.add(coachId);
              coachesMap.set(coachId, coach as any);
            }
          }
        }
      }

      // Mapear al JSON solicitado y retornar como array
      const result = Array.from(coachesMap.values()).map((c: any) => ({
        role: c.role,
        username: c.username || null,
        password: c.password || null,
        name: c.name || null,
        lastname: c.lastname || null,
        gender: c.gender || null,
        birth_date: c.birth_date || null,
        ci: c.ci || null,
        active: typeof c.active === 'boolean' ? c.active : true,
        phone: c.phone || null,
        images: {
          small: c.images?.small || null,
          medium: c.images?.medium || null,
          large: c.images?.large || null,
        },
        _id: c._id,
      }));

      return result;
    } catch (error) {
      console.error('Error al obtener coaches desde grupos:', error);
      return [];
    }
  }

  /**
   * Obtiene todos los atletas registrados en los grupos del club del admin
   * Filtra por assignments -> clubes -> grupos -> athletes
   */
  async getAthletesFromGroups(requestingUser: currentAuth): Promise<any[]> {
    try {
      // Obtener assignments del admin
      const adminAssignments =
        await this.assignmentsService.getAssignmentsByAdmin(requestingUser.sub);

      if (!adminAssignments || adminAssignments.length === 0) {
        return [];
      }

      // Obtener todos los clubes del admin
      const clubIds = adminAssignments[0]?.clubs || [];

      if (!clubIds || clubIds.length === 0) {
        return [];
      }

      // Obtener todos los grupos de esos clubes
      const groups = await this.groupModel
        .find({ club_id: { $in: clubIds } })
        .populate('athletes')
        .exec();

      // Extraer athletes únicos
      const uniqueAthleteIds = new Set<string>();
      const athletesMap = new Map<string, User>();

      for (const group of groups) {
        if (group.athletes && Array.isArray(group.athletes)) {
          for (const athlete of group.athletes) {
            if (athlete && (athlete as any)._id) {
              const athleteId = (athlete as any)._id.toString();
              uniqueAthleteIds.add(athleteId);
              athletesMap.set(athleteId, athlete as any);
            }
          }
        }
      }

      // Mapear al JSON solicitado y retornar como array
      const result = Array.from(athletesMap.values()).map((a: any) => ({
        role: a.role,
        username: a.username || null,
        password: a.password || null,
        name: a.name || null,
        lastname: a.lastname || null,
        gender: a.gender || null,
        birth_date: a.birth_date || null,
        ci: a.ci || null,
        active: typeof a.active === 'boolean' ? a.active : true,
        phone: a.phone || null,
        parent_id: a.parent_id || null,
        images: {
          small: a.images?.small || null,
          medium: a.images?.medium || null,
          large: a.images?.large || null,
        },
        _id: a._id,
      }));

      return result;
    } catch (error) {
      console.error('Error al obtener atletas desde grupos:', error);
      return [];
    }
  }

  /**
   * Carga y procesa una imagen de usuario mediante image-processor
   * Recibe imagen en base64, la envía al servicio image-processor
   * y guarda las URLs de las imágenes procesadas
   */
  async uploadUserImage(payload: any): Promise<any> {
    try {
      const { userId, imageBase64, role } = payload;

      if (!userId || !imageBase64) {
        throw new Error('userId e imageBase64 son requeridos');
      }

      // Procesar la imagen con image-processor
      const imageUrls = await this.processImageWithImageProcessor(imageBase64);

      // Actualizar el usuario con las URLs de imagen
      const updateData: UpdateUserDto = {
        images: imageUrls,
        role: (role || 'coach') as any,
      };

      const updatedUser = await this.userRepository.updateById(
        userId,
        updateData,
      );

      return {
        code: 200,
        message: 'Imagen cargada exitosamente',
        data: updatedUser,
      };
    } catch (error: any) {
      const errorMessage =
        error?.message || 'Error desconocido al procesar la imagen';
      throw new ServiceUnavailableException(
        `Error al procesar la imagen: ${errorMessage}`,
      );
    }
  }

  /**
   * Procesa la imagen con el servicio image-processor
   * Simula o realiza la comunicación con image-processor
   */
  private async processImageWithImageProcessor(
    imageBase64: string,
  ): Promise<any> {
    const axios = require('axios');
    const imageProcessorApi = this.configService.get<string>(
      'IMAGE_PROCESSOR_API',
    );

    if (!imageProcessorApi) {
      throw new Error('IMAGE_PROCESSOR_API no configurada');
    }

    try {
      // Primero, procesa la imagen (redimensiona, optimiza, etc.)
      const processResponse = await axios.post(
        `${imageProcessorApi}/api/process`,
        {
          image: imageBase64,
        },
      );

      if (!processResponse.data || !processResponse.data.image) {
        throw new Error(
          'Respuesta inválida del procesador: ' +
            JSON.stringify(processResponse.data),
        );
      }

      // Luego, guarda las variantes (small, medium, large)
      const saveResponse = await axios.post(
        `${imageProcessorApi}/api/process/save`,
        {
          folder: this.folder,
          image: processResponse.data.image,
        },
      );

      if (
        !saveResponse.data ||
        !saveResponse.data.images ||
        !saveResponse.data.images.small ||
        !saveResponse.data.images.medium ||
        !saveResponse.data.images.large
      ) {
        throw new Error(
          'Error al guardar variantes de imagen: ' +
            JSON.stringify(saveResponse.data),
        );
      }

      return saveResponse.data.images;
    } catch (error: any) {
      // Lanzar error más informativo
      if (error?.response?.status) {
        throw new Error(
          `Image Processor error (${error.response.status}): ${
            error.response.data?.message || error.message
          }`,
        );
      } else if (error?.code === 'ECONNREFUSED') {
        throw new Error(
          `No se puede conectar a Image Processor en ${imageProcessorApi}. Verifique que el servicio esté corriendo.`,
        );
      } else {
        throw new Error(
          `Error al procesar imagen: ${error?.message || 'Error desconocido'}`,
        );
      }
    }
  }
}
