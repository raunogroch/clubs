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
import { RegistrationsService } from '../registrations/registrations.service';
import bcrypt from 'bcryptjs';

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
    private readonly registrationsService?: RegistrationsService,
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
    // Primero generar username y password según el rol, ANTES de validar

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

      // Asegurar que el username sea único (independientemente del role)
      while (await this.userValidator.usernameExists(username)) {
        username = `${baseUsername}${counter}`;
        counter++;
      }
      createUserDto.username = username;

      // Usar CI como password
      createUserDto.password = createUserDto.ci;
    }

    // Para COACH, generar username y password automáticamente
    if (createUserDto.role === Roles.COACH) {
      // Generar username de estructura: firstname.lastname
      const firstName =
        createUserDto.name?.toLowerCase().split(' ')[0] || 'coach';
      const lastName =
        createUserDto.lastname?.toLowerCase().split(' ')[0] || 'user';
      const baseUsername = `${firstName}.${lastName}`;
      let username = baseUsername;
      let counter = 1;

      // Asegurar que el username sea único (independientemente del role)
      while (await this.userValidator.usernameExists(username)) {
        username = `${baseUsername}${counter}`;
        counter++;
      }
      createUserDto.username = username;

      // Usar CI como password
      createUserDto.password = createUserDto.ci;
    }

    // Para ASSISTANT, generar username y password automáticamente
    if (createUserDto.role === Roles.ASSISTANT) {
      // Generar username de estructura: firstname.lastname
      const firstName =
        createUserDto.name?.toLowerCase().split(' ')[0] || 'assistant';
      const lastName =
        createUserDto.lastname?.toLowerCase().split(' ')[0] || 'user';
      const baseUsername = `${firstName}.${lastName}`;
      let username = baseUsername;
      let counter = 1;

      // Asegurar que el username sea único (independientemente del role)
      while (await this.userValidator.usernameExists(username)) {
        username = `${baseUsername}${counter}`;
        counter++;
      }
      createUserDto.username = username;

      // Usar CI como password
      createUserDto.password = createUserDto.ci;
    }

    // Para ATHLETE, generar username único si se proporciona
    if (createUserDto.role === Roles.ATHLETE && createUserDto.username) {
      const baseUsername = createUserDto.username;
      let username = baseUsername;
      let counter = 1;

      // Asegurar que el username sea único (independientemente del role)
      while (await this.userValidator.usernameExists(username)) {
        username = `${baseUsername}${counter}`;
        counter++;
      }
      createUserDto.username = username;
    }

    // Validar campos requeridos según el rol, DESPUÉS de generar username/password
    this.validateRequiredFieldsByRole(createUserDto);

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
    return this.userRepository.updateById(id, {
      active: false,
    } as UpdateUserDto);
  }

  /**
   * Restaurar (reactivar) un usuario previamente desactivado
   */
  async restore(id: string): Promise<User | null> {
    await this.userValidator.validateExistence(id);
    return this.userRepository.updateById(id, {
      active: true,
    } as UpdateUserDto);
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
        createdAt: c.createdAt || null,
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

      // Obtener todos los grupos de esos clubes y sus IDs
      const groups = await this.groupModel
        .find({ club_id: { $in: clubIds } })
        .exec();
      const groupIds = groups.map((g) => (g as any)._id.toString());

      // Obtener registros (registrations) para esos grupos
      const registrations = this.registrationsService
        ? await this.registrationsService.findByGroups(groupIds)
        : [];

      // Extraer athletes únicos desde los registros
      const uniqueAthleteIds = new Set<string>();
      const athletesMap = new Map<string, User>();

      for (const reg of registrations) {
        const athlete = (reg as any).athlete_id;
        if (athlete && athlete._id) {
          const athleteId = athlete._id.toString();
          uniqueAthleteIds.add(athleteId);
          // Store athlete data along with the registration date so frontend can show it
          const regDate =
            (reg as any).registration_date || (reg as any).createdAt || null;
          athletesMap.set(athleteId, {
            ...(athlete as any),
            registration_date: regDate,
          });
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
        createdAt: a.createdAt || null,
        registration_date: a.registration_date || null,
        documentPath: a.documentPath || null,
        fileIdentifier: a.fileIdentifier || null,
      }));

      return result;
    } catch (error) {
      console.error('Error al obtener atletas desde grupos:', error);
      return [];
    }
  }

  /**
   * Devuelve, por cada assignment del admin, la cantidad de atletas (únicos)
   * dentro del assignment cuyo `registration_pay` es `false`.
   * Resultado: [{ assignment_id, assignment_name, unpaidCount }]
   */
  async getUnpaidAthletesCountByAssignment(
    requestingUser: currentAuth,
  ): Promise<any[]> {
    try {
      const adminAssignments =
        await this.assignmentsService.getAssignmentsByAdmin(requestingUser.sub);

      if (!adminAssignments || adminAssignments.length === 0) {
        return [];
      }

      const results: any[] = [];

      for (const assignment of adminAssignments) {
        const clubIds: string[] = Array.isArray((assignment as any).clubs)
          ? (assignment as any).clubs.map((c: any) => c.toString())
          : [];
        if (!clubIds || clubIds.length === 0) {
          results.push({ assignment_id: (assignment as any)._id || null, assignment_name: (assignment as any).module_name || null, unpaidCount: 0, totalRegistered: 0 });
          continue;
        }

        // Obtener todos los grupos para esos clubes
        const groups = await this.groupModel.find({ club_id: { $in: clubIds } }).exec();
        const groupIds = groups.map((g) => (g as any)._id.toString());

        if (groupIds.length === 0) {
          results.push({ assignment_id: (assignment as any)._id || null, assignment_name: (assignment as any).module_name || null, unpaidCount: 0, totalRegistered: 0 });
          continue;
        }

        // Obtener registros para esos grupos
        const registrations = this.registrationsService
          ? await this.registrationsService.findByGroups(groupIds)
          : [];

        // Contar atletas únicos con registration_pay === false y total registrados
        const unpaidAthletes = new Set<string>();
        const allAthletes = new Set<string>();
        for (const reg of registrations) {
          const regObj: any = reg as any;

          // athlete_id may be populated object or raw id
          const athleteField = regObj.athlete_id;
          let athleteId: string | null = null;
          if (!athleteField) {
            athleteId = null;
          } else if (typeof athleteField === 'string') {
            athleteId = athleteField;
          } else if (athleteField._id) {
            athleteId = (athleteField._id || athleteField).toString();
          } else {
            try {
              athleteId = athleteField.toString();
            } catch (e) {
              athleteId = null;
            }
          }

          if (athleteId) {
            allAthletes.add(athleteId);
            // consider unpaid when registration_pay is not explicitly true
            const isUnpaid = regObj.registration_pay !== true;
            if (isUnpaid) unpaidAthletes.add(athleteId);
          }
        }

        results.push({
          assignment_id: (assignment as any)._id || null,
          assignment_name: (assignment as any).module_name || null,
          unpaidCount: unpaidAthletes.size,
          totalRegistered: allAthletes.size,
        });
      }

      return results;
    } catch (error) {
      console.error('Error al obtener conteos de pagos pendientes por assignment:', error);
      return [];
    }
  }

  /**
   * Devuelve desglose detallado de atletas registrados por club y grupo del assignment
   * Resultado: { total: number, clubs: [{ clubId, clubName, groups: [{ groupId, groupName, athleteCount, athletes: [...] }] }] }
   */
  async getAthletesBreakdownByAssignment(
    requestingUser: currentAuth,
  ): Promise<any> {
    try {
      const adminAssignments =
        await this.assignmentsService.getAssignmentsByAdmin(requestingUser.sub);

      if (!adminAssignments || adminAssignments.length === 0) {
        return { total: 0, clubs: [] };
      }

      const clubIds: string[] = Array.isArray((adminAssignments[0] as any).clubs)
        ? (adminAssignments[0] as any).clubs.map((c: any) => c.toString())
        : [];

      if (!clubIds || clubIds.length === 0) {
        return { total: 0, clubs: [] };
      }

      // Obtener clubes
      const clubModel = this.groupModel.db.model('Club');
      const clubs = await clubModel.find({ _id: { $in: clubIds } }).exec();

      const clubsBreakdown: any[] = [];
      let totalAthletes = 0;

      for (const club of clubs) {
        const clubId = (club as any)._id.toString();
        const clubName = (club as any).name || 'Club sin nombre';

        // Obtener grupos del club
        const groups = await this.groupModel
          .find({ club_id: new (require('mongoose').Types.ObjectId)(clubId) })
          .exec();

        const groupsBreakdown: any[] = [];

        for (const group of groups) {
          const groupId = (group as any)._id.toString();
          const groupName = (group as any).name || 'Grupo sin nombre';

          // Obtener registrations del grupo
          const registrations = this.registrationsService
            ? await this.registrationsService.findByGroups([groupId])
            : [];

          // Contar atletas únicos en este grupo y cuántos tienen pago pendiente
          const athleteIds = new Set<string>();
          const unpaidAthleteIds = new Set<string>();
          for (const reg of registrations) {
            const athleteField = (reg as any).athlete_id;
            let athleteId: string | null = null;
            if (!athleteField) {
              athleteId = null;
            } else if (typeof athleteField === 'string') {
              athleteId = athleteField;
            } else if (athleteField._id) {
              athleteId = (athleteField._id || athleteField).toString();
            } else {
              try {
                athleteId = athleteField.toString();
              } catch (e) {
                athleteId = null;
              }
            }
            if (athleteId) {
              athleteIds.add(athleteId);
              // Contar como unpaid si registration_pay no es true
              const isUnpaid = (reg as any).registration_pay !== true;
              if (isUnpaid) {
                unpaidAthleteIds.add(athleteId);
              }
            }
          }

          if (athleteIds.size > 0) {
            groupsBreakdown.push({
              groupId,
              groupName,
              athleteCount: athleteIds.size,
              unpaidCount: unpaidAthleteIds.size,
            });
            totalAthletes += athleteIds.size;
          }
        }

        if (groupsBreakdown.length > 0) {
          clubsBreakdown.push({
            clubId,
            clubName,
            groups: groupsBreakdown,
          });
        }
      }

      return { total: totalAthletes, clubs: clubsBreakdown };
    } catch (error) {
      console.error('Error al obtener desglose de atletas por assignment:', error);
      return { total: 0, clubs: [] };
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

  /**
   * Cargar PDF de Carnet de Identidad para un atleta
   * Envía el PDF a image-processor y guarda la ruta en la base de datos
   */
  async uploadAthleteCI(payload: any): Promise<any> {
    try {
      const { userId, pdfBase64, role } = payload;

      if (!userId || !pdfBase64) {
        throw new Error('userId y pdfBase64 son requeridos');
      }

      // Procesar el PDF con image-processor
      const pdfResponse = await this.processCIWithImageProcessor(
        pdfBase64,
        userId,
      );

      // Actualizar el usuario con la ruta del PDF
      const updateData: UpdateUserDto = {
        documentPath: pdfResponse.pdfPath,
        role: (role || 'athlete') as any,
      };

      const updatedUser = await this.userRepository.updateById(
        userId,
        updateData,
      );

      return {
        code: 200,
        message: 'CI cargado exitosamente',
        data: {
          documentPath: pdfResponse.pdfPath,
          fileIdentifier: pdfResponse.fileIdentifier,
        },
      };
    } catch (error: any) {
      const errorMessage =
        error?.message || 'Error desconocido al procesar el CI';
      throw new ServiceUnavailableException(
        `Error al procesar el CI: ${errorMessage}`,
      );
    }
  }

  /**
   * Procesa el PDF del CI con el servicio image-processor
   */
  private async processCIWithImageProcessor(
    pdfBase64: string,
    userId: string,
  ): Promise<{ pdfPath: string; fileIdentifier: string }> {
    const axios = require('axios');
    const imageProcessorApi = this.configService.get<string>(
      'IMAGE_PROCESSOR_API',
    );

    if (!imageProcessorApi) {
      throw new Error('IMAGE_PROCESSOR_API no configurada');
    }

    try {
      // Obtener el fileIdentifier del usuario si existe
      const user = await this.userRepository.findById(userId);
      const fileIdentifier = user?.fileIdentifier;

      // Guardar el PDF en image-processor
      const saveResponse = await axios.post(
        `${imageProcessorApi}/api/process/save-pdf`,
        {
          pdf: pdfBase64,
          folder: 'pdfs',
          fileIdentifier: fileIdentifier,
        },
      );

      if (!saveResponse.data || !saveResponse.data.pdfPath) {
        throw new Error(
          'Respuesta inválida del procesador: ' +
            JSON.stringify(saveResponse.data),
        );
      }

      // Construir URL absoluta del PDF
      const absolutePdfUrl = `${imageProcessorApi}${saveResponse.data.pdfPath}`;

      return {
        pdfPath: absolutePdfUrl,
        fileIdentifier: saveResponse.data.fileIdentifier,
      };
    } catch (error: any) {
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
          `Error al procesar CI: ${error?.message || 'Error desconocido'}`,
        );
      }
    }
  }

  /**
   * Cambiar la contraseña del usuario autenticado
   *
   * @param userId - ID del usuario autenticado
   * @param currentPassword - Contraseña actual (para validación)
   * @param newPassword - Nueva contraseña
   * @returns { code: 200, message: "Contraseña actualizada correctamente" }
   * @throws NotFoundException si el usuario no existe
   * @throws Error si la contraseña actual es incorrecta
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ code: number; message: string }> {
    try {
      // Obtener el usuario por ID
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
      }

      // Validar que el usuario tenga contraseña configurada
      if (!user.password) {
        throw new Error('El usuario no tiene contraseña configurada');
      }

      // Validar que la contraseña actual sea correcta
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isPasswordValid) {
        throw new Error('La contraseña actual es incorrecta');
      }

      // Hashear la nueva contraseña
      const hashedPassword = await this.userPasswordService.hashPassword(
        newPassword,
      );

      // Actualizar la contraseña
      await this.userRepository.updateById(userId, {
        password: hashedPassword,
      });

      return {
        code: 200,
        message: 'Contraseña actualizada correctamente',
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error al cambiar la contraseña');
    }
  }

  /**
   * Resetear la contraseña de un usuario a su CI
   *
   * @param userId - ID del usuario cuya contraseña se resetea
   * @returns { code: 200, message: "Contraseña actualizada a su CI" }
   * @throws NotFoundException si el usuario no existe
   */
  async resetPassword(
    userId: string,
  ): Promise<{ code: number; message: string }> {
    try {
      // Obtener el usuario por ID
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
      }

      // Validar que el usuario tenga CI configurado
      if (!user.ci) {
        throw new Error('El usuario no tiene CI configurado');
      }

      // Hashear el CI como nueva contraseña
      const hashedPassword = await this.userPasswordService.hashPassword(
        user.ci,
      );

      // Actualizar la contraseña
      await this.userRepository.updateById(userId, {
        password: hashedPassword,
      });

      return {
        code: 200,
        message: 'Contraseña actualizada a su CI',
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error al resetear la contraseña');
    }
  }
}
