import { Boleto } from '@/boleto/domain'

export interface BoletoRepository {
  findBoleto: (codigo: string) => Promise<Boleto>
}
