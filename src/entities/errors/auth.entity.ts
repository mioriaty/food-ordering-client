import { HttpErrorEntity } from '@/entities/errors/http.entity';

export const ENTITY_ERROR_STATUS = 422;
export const AUTHENTICATION_ERROR_STATUS = 401;

export type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class RequestErrorEntity extends HttpErrorEntity {
  status: typeof ENTITY_ERROR_STATUS;
  payload: EntityErrorPayload;
  constructor({ status, payload }: { status: typeof ENTITY_ERROR_STATUS; payload: EntityErrorPayload }) {
    super({ status, payload, message: 'Lỗi thực thể' });
    this.status = status;
    this.payload = payload;
  }
}
