import { Boleto } from '@/boleto/domain'

export class BuscarBoleto {
  async execute(codigo: string): Promise<Boleto> {
    const replacedBoleto = codigo.replace(/[^a-z0-9]/gi, '')

    const boleto = new Boleto(replacedBoleto)

    return boleto
  }
}
