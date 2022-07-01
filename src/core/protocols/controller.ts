import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  initial(): string {
    return 'Run application - initial route'
  }
}
