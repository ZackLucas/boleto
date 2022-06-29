import { BadRequestError } from '@/core/domain';
import { Boleto } from '@/boleto/domain';
import { create } from 'domain';
import { BoletoRepository } from '../';

export class BuscarBoleto {
  constructor() {}

  async execute(codigo: string): Promise<Boleto> {
    const replacedBoleto = codigo.replace(/[^a-z0-9]/gi, '')

    const boleto = new Boleto(replacedBoleto);

    console.log(boleto)

    return boleto
  }
}
