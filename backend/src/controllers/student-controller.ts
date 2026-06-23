import type { Request, Response } from 'express';
import { studentListSchema, studentSchema } from '../services/schemas.js';
import { StudentService } from '../services/student-service.js';
import { getPagination } from '../utils/pagination.js';
import type { AuthenticatedRequest } from '../middlewares/auth-middleware.js';

function routeId(request: Request) {
  return Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
}

export class StudentController {
  constructor(private readonly service: StudentService) {}

  list = async (request: AuthenticatedRequest, response: Response) => {
    const query = studentListSchema.parse(request.query);
    const pagination = getPagination(query.page, query.pageSize);
    const result = await this.service.list(request.userId ?? '', pagination.page, pagination.pageSize, pagination.skip, {
      search: query.search,
      status: query.status,
      planId: query.planId,
    });
    return response.status(200).json(result);
  };

  getById = async (request: AuthenticatedRequest, response: Response) => {
    const result = await this.service.getById(request.userId ?? '', routeId(request));
    return response.status(200).json(result);
  };

  create = async (request: AuthenticatedRequest, response: Response) => {
    const payload = studentSchema.parse(request.body);
    const result = await this.service.create(request.userId ?? '', payload);
    return response.status(201).json(result);
  };

  update = async (request: AuthenticatedRequest, response: Response) => {
    const payload = studentSchema.parse(request.body);
    const result = await this.service.update(request.userId ?? '', routeId(request), payload);
    return response.status(200).json(result);
  };

  delete = async (request: AuthenticatedRequest, response: Response) => {
    await this.service.delete(request.userId ?? '', routeId(request));
    return response.status(204).send();
  };
}
