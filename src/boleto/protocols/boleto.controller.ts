import { Controller, Get, Param } from '@nestjs/common'
import { BuscarBoleto } from '@/boleto/data'
import { BoletoBancario, BoletoConcessionario } from '../domain'

@Controller('boleto')
export class BoletoController {
  @Get('/:linhaDigitada')
  async teste(@Param('linhaDigitada') linha: string): Promise<BoletoBancario | BoletoConcessionario> {
    const useCase = new BuscarBoleto()

    return await useCase.execute(linha)
  }
}
