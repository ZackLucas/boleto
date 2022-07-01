import { Module } from '@nestjs/common'

import { ModuloBoleto } from '../../boleto/protocols/module'

import { AppController } from './'

@Module({
  imports: [ModuloBoleto],
  controllers: [AppController],
})
export class AppModule {}
