import { BadRequestError } from '@/core/domain'

export class CodigoInvalidoError extends BadRequestError {
  constructor(param: string, message?: string) {
    super(param, message || `${param} inválido`)
  }
}
