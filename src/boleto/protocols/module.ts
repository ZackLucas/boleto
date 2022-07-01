import { Module } from '@nestjs/common'
import { BoletoController } from './boleto.controller'

@Module({
  controllers: [BoletoController],
})
export class ModuloBoleto {}
