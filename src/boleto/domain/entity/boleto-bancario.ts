import { addDays, format } from 'date-fns'

import { CodigoInvalidoError } from '../'
import { Boleto } from './'

export class BoletoBancario extends Boleto {
  constructor(linhaDigitavel: string) {
    super(linhaDigitavel)
    this.expirationDate = this.obterDataVencimento()
    this.amount = this.obterValorNota()
    this.validador()
  }

  private validador() {
    this.validarDigitosVerificadores()
    this.validarDigitoVerificadorPrincipal()
  }

  public obterValorNota() {
    return Number(this.linhaDigitavel.slice(37))
  }

  public obterDataVencimento() {
    const date = addDays(new Date('10/07/1997'), Number(this.linhaDigitavel.slice(33, 37)))

    return format(date, 'yyyy-MM-dd')
  }

  public obterCodigoDeBarraIncompleto() {
    return (
      this.linhaDigitavel.slice(0, 3) +
      this.linhaDigitavel[3] +
      this.linhaDigitavel.slice(33, 37) +
      this.linhaDigitavel.slice(37) +
      this.linhaDigitavel.slice(4, 9) +
      this.linhaDigitavel.slice(10, 20) +
      this.linhaDigitavel.slice(21, 31)
    )
  }

  private validarDigitosVerificadores() {
    const primeiroDigito = this.calculoModulo10(this.linhaDigitavel.slice(0, 9), 2)
    const segundoDigito = this.calculoModulo10(this.linhaDigitavel.slice(10, 20), 1)
    const terceiroDigito = this.calculoModulo10(this.linhaDigitavel.slice(21, 31), 1)

    if (primeiroDigito !== Number(this.linhaDigitavel[9]))
      throw new CodigoInvalidoError('boleto', 'erro no digito verificador 1.')

    if (segundoDigito !== Number(this.linhaDigitavel[20]))
      throw new CodigoInvalidoError('boleto', 'erro no digito verificador 2.')

    if (terceiroDigito !== Number(this.linhaDigitavel[31]))
      throw new CodigoInvalidoError('boleto', 'erro no digito verificador 3.')
  }

  validarDigitoVerificadorPrincipal() {
    if (this.barCode[4] !== this.linhaDigitavel[32]) throw new CodigoInvalidoError('Digito verificador principal')
  }
}
