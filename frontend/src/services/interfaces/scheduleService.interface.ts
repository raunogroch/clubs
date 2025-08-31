export interface IScheduleService {
  getAll(): Promise<any>;
  getById(id: string): Promise<any>;
  delete(id: string): Promise<any>;
  update(id: string, data: any): Promise<any>;
  create(data: any): Promise<any>;
}
