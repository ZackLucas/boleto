export class Boleto {
  public linhaDigitavel: string
  public barCode: string
  public amount: number
  expirationDate: string

  constructor(linhaDigitavel: string) {
    this.linhaDigitavel = linhaDigitavel
    this.barCode = this.obterCodigoDeBarra()
  }

  public getBarCodeIncompleto() {
    return ''
  }

  public obterCodigoDeBarra() {
    const incompleto = this.getBarCodeIncompleto()
    const digitoVerificador = this.calculoModulo11()

    return `${incompleto.slice(0, 4)}${digitoVerificador}${incompleto.slice(4)}`
  }

  public normalizeNumber(value: number) {
    return value
      .toString()
      .split('')
      .reduce((accumulator, curr) => accumulator + Number(curr), 0)
  }

  public calculoModulo10(codigo: string, multiplicador: number): number {
    const total = codigo.split('').reduce((last, actual) => {
      let value = Number(actual) * multiplicador
      multiplicador = multiplicador === 2 ? 1 : 2

      if (value > 9) value = this.normalizeNumber(value)
      return last + value
    }, 0)

    const response = 10 - (total % 10)

    if (response === 10) return 0

    return response
  }

  public calculoModulo11() {
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
}
