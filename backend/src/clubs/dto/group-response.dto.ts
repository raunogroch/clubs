/**
 * DTO para respuesta de grupo (formateo de datos)
 */

export class GroupResponseDto {
  _id: string;
  name: string;
  description?: string;
  club_id: string;
  created_by: {
    _id: string;
    email?: string;
    name?: string;
  };
  members: {
    _id: string;
    email?: string;
    name?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
