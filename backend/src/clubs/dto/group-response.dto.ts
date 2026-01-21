/**
 * DTO para respuesta de grupo (formateo de datos)
 */

export class GroupResponseDto {
  _id: string;
  name: string;
  description?: string;
  club_id: string;
  monthly_fee?: number;
  created_by: {
    _id: string;
    name?: string;
  };
  members: {
    _id: string;
    name?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
