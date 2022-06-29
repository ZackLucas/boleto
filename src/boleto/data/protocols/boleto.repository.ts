import { Boleto } from '@/boleto/domain'

export interface BoletoRepository {
  findBoleto: (codigo: String) => Promise<Boleto>
}