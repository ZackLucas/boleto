import { Controller, Get, Param } from '@nestjs/common'
import { BuscarBoleto } from '@/boleto/data'
import { Boleto } from '../domain'

@Controller('boleto')
export class BoletoController {
  @Get('/:barCode')
  async teste(@Param('barCode') codigo: string): Promise<Boleto> {
    const useCase = new BuscarBoleto()

    return await useCase.execute(codigo)
  }
}
