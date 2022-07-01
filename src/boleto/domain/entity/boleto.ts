import { InvalidParamError } from '@/core/domain'
import { addDays } from 'date-fns'

export class Boleto {
  public linhaDigitavel: string
  public barCode: string
  public amount: number
  public bankCode: string
  expirationDate: Date

  constructor(linhaDigitavel: string) {
    this.linhaDigitavel = linhaDigitavel
    this.barCode = this.obterCodigoDeBarra()
    this.expirationDate = this.getDueAt()
    this.amount = this.getAmount()
    this.validator()
  }

  private validator() {
    this.validarDigitosVerificadores()
  }

  private getBankPosition() {
    return this.linhaDigitavel.slice(0, 3)
  }

  private getCoinPosition() {
    return this.linhaDigitavel[3]
  }

  private getFatorVencimentoPosition() {
    return this.linhaDigitavel.slice(33, 37)
  }

  private getDueAt() {
    return addDays(new Date('10/07/1997'), Number(this.getFatorVencimentoPosition()))
  }

  private getValorPosition() {
    return this.linhaDigitavel.slice(37)
  }

  private getAmount() {
    return Number()
  }

  private getBarCodeIncompleto() {
    return (
      this.getBankPosition() +
      this.getCoinPosition() +
      this.getFatorVencimentoPosition() +
      this.getValorPosition() +
      this.linhaDigitavel.slice(4, 9) +
      this.linhaDigitavel.slice(10, 20) +
      this.linhaDigitavel.slice(21, 31)
    )
  }

  private obterCodigoDeBarra() {
    const incompleto = this.getBarCodeIncompleto()
    const digitoVerificador = this.obterCodigoVerificador()

    return `${incompleto.slice(0, 4)}${digitoVerificador}${incompleto.slice(4)}`
  }

  private obterCodigoVerificador() {
    const codigoIncompleto = this.getBarCodeIncompleto()

    let multiplicador = 2
    const total = codigoIncompleto
      .split('')
      .reverse()
      .reduce((prev, curr) => {
        const value = Number(curr) * multiplicador

        multiplicador++
        if (multiplicador === 10) multiplicador = 2

        return value + prev
      }, 0)

    const dig = 11 - (total % 11)

    if (dig === 0 || dig === 10 || dig === 11) return 1

    return dig
  }

  private validarDigitosVerificadores() {
    const primeiroDigito = this.obterDigitoVerificador(this.linhaDigitavel.slice(0, 10), 2)
    const segundoDigito = this.obterDigitoVerificador(this.linhaDigitavel.slice(10, 20), 1)
    const terceiroDigito = this.obterDigitoVerificador(this.linhaDigitavel.slice(21, 31), 1)

    if (
      primeiroDigito !== Number(this.linhaDigitavel[10]) ||
      segundoDigito !== Number(this.linhaDigitavel[20]) ||
      terceiroDigito !== Number(this.linhaDigitavel[31])
    ) {
      throw new InvalidParamError('boleto', 'boleto inválido.')
    }
  }

  private proximaDezena(value: number) {
    return Math.ceil(value / 10) * 10
  }

  private normalizeNumber(value: number) {
    const normalizedValue = value
      .toString()
      .split('')
      .reduce((accumulator, curr) => accumulator + Number(curr), 0)

    if (normalizedValue < 10) return normalizedValue
    return this.normalizeNumber(normalizedValue)
  }

  private obterDigitoVerificador(codigo: string, multiplicador: number): number {
    const digitoVerificador = codigo.split('').reduce((last, actual) => {
      let value = Number(actual) * multiplicador
      multiplicador = multiplicador === 2 ? 1 : 2

      if (value > 9) value = this.normalizeNumber(value)
      return last + value
    }, 0)

    return this.proximaDezena(digitoVerificador) - digitoVerificador
  }
}
