import { InvalidParamError } from '@/core/domain';
import { addDays } from 'date-fns';

export class Boleto {
  public linhaDigitavel: string;
  public barCode: string;
  public amount: number;
  expirationDate: Date;

  constructor(linhaDigitavel: string) {
    this.linhaDigitavel = linhaDigitavel;
    this.barCode = this.obterCodigoDeBarra();
    this.expirationDate = this.getDueAt();
    this.amount = this.getAmount();
  }

  public getDueAt() {
    return addDays(new Date('10/07/1997'), Number(this.linhaDigitavel.slice(33, 37)));
  }

  public getAmount() {
    return Number(this.linhaDigitavel.slice(37));
  }

  public getBarCodeIncompleto() {
    return '';
  }

  public obterCodigoDeBarra() {
    const incompleto = this.getBarCodeIncompleto();
    const digitoVerificador = this.calculoModulo11();

    return `${incompleto.slice(0, 4)}${digitoVerificador}${incompleto.slice(4)}`;
  }

  public normalizeNumber(value: number) {
    return value
      .toString()
      .split('')
      .reduce((accumulator, curr) => accumulator + Number(curr), 0);
  }

  public calculoModulo10(codigo: string, multiplicador: number): number {
    const total = codigo.split('').reduce((last, actual) => {
      let value = Number(actual) * multiplicador;
      multiplicador = multiplicador === 2 ? 1 : 2;

      if (value > 9) value = this.normalizeNumber(value);
      return last + value;
    }, 0);

    return 10 - (total % 10);
  }

  public calculoModulo11() {
    const codigoIncompleto = this.getBarCodeIncompleto();

    let multiplicador = 2;
    const total = codigoIncompleto
      .split('')
      .reverse()
      .reduce((prev, curr) => {
        let value = Number(curr) * multiplicador;

        multiplicador++;
        if (multiplicador === 10) multiplicador = 2;

        return value + prev;
      }, 0);

    const dig = 11 - (total % 11);

    if (dig === 0 || dig === 10 || dig === 11) return 1;

    return dig;
  }
}
