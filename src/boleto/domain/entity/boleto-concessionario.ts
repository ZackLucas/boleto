import { format, isValid } from 'date-fns'

import { BadRequestError } from '@/core/domain'

import { Boleto } from './boleto'

export class BoletoConcessionario extends Boleto {
  constructor(linhaDigitavel: string) {
    super(linhaDigitavel)
    this.barCode = this.obterCodigoDeBarra()
    this.expirationDate = this.obterDataVencimento()
    this.amount = this.obterValorNota()
    this.validador()
  }

  private validador() {
    if (this.linhaDigitavel.length !== 48) {
      throw new BadRequestError('linha digitada', 'A linha digitada deve possuir 48 números')
    }
    this.validarDigitosVerificadores()
  }

  public obterDataVencimento() {
    const a = this.barCode.slice(19, 27)
    const b = this.barCode.slice(23, 31)

    const aDate = new Date(`${a.slice(0, 4)}/${a.slice(4, 6)}/${a.slice(6)}`)
    const bDate = new Date(`${b.slice(0, 4)}/${b.slice(4, 6)}/${b.slice(6)}`)

    const baseDate = new Date('1997/10/01')

    if (isValid(aDate) && aDate > baseDate) return format(aDate, 'yyyy-MM-dd')
    if (isValid(bDate) && bDate > baseDate) return format(bDate, 'yyyy-MM-dd')

    return 'não especificado.'
  }

  public obterValorNota() {
    return Number(this.barCode.slice(5, 15))
  }

  public obterCodigoDeBarra() {
    return (
      this.linhaDigitavel.slice(0, 11) +
      this.linhaDigitavel.slice(12, 23) +
      this.linhaDigitavel.slice(24, 35) +
      this.linhaDigitavel.slice(36, 47)
    )
  }

  private validarDigitosVerificadores() {
    const primeiroDigito = super.calculoModulo10(this.linhaDigitavel.slice(0, 11), 2)
    const segundoDigito = super.calculoModulo10(this.linhaDigitavel.slice(12, 23), 2)
    const terceiroDigito = super.calculoModulo10(this.linhaDigitavel.slice(24, 35), 2)
    const quartoDigito = super.calculoModulo10(this.linhaDigitavel.slice(36, 47), 2)

    if (primeiroDigito !== Number(this.linhaDigitavel[11]))
      throw new BadRequestError('boleto', 'erro no digito verificador 1.')

    if (segundoDigito !== Number(this.linhaDigitavel[23]))
      throw new BadRequestError('boleto', 'erro no digito verificador 2.')

    if (terceiroDigito !== Number(this.linhaDigitavel[35]))
      throw new BadRequestError('boleto', 'erro no digito verificador 3.')

    if (quartoDigito !== Number(this.linhaDigitavel[47]))
      throw new BadRequestError('boleto', 'erro no digito verificador 4.')
  }
}
