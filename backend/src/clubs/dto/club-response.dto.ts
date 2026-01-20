/**
 * DTO para la respuesta de un club
 */

export class ClubResponseDto {
  _id: string;
  name: string;
  description?: string;
  location?: string;
  assignment_id: string;
  created_by: string;
  members: string[];
  createdAt: Date;
  updatedAt: Date;
}
