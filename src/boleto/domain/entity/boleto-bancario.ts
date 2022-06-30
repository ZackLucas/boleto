import { InvalidParamError } from '@/core/domain';

import { CodigoInvalidoError } from '../';
import { Boleto } from './';

export class BoletoBancario extends Boleto {
  expirationDate: Date;

  constructor(linhaDigitavel: string) {
    super(linhaDigitavel);
    this.validator();
  }

  private validator() {
    if (this.linhaDigitavel.length !== 47) {
      throw new CodigoInvalidoError('linha digitada', 'A linha digitada deve possuir 47 números');
    }
    this.validarDigitosVerificadores();
    this.validarDigitoVerificadorPrincipal();
  }

  public getBarCodeIncompleto() {
    return (
      this.linhaDigitavel.slice(0, 3) +
      this.linhaDigitavel[3] +
      this.linhaDigitavel.slice(33, 37) +
      this.linhaDigitavel.slice(37) +
      this.linhaDigitavel.slice(4, 9) +
      this.linhaDigitavel.slice(10, 20) +
      this.linhaDigitavel.slice(21, 31)
    );
  }

  private validarDigitosVerificadores() {
    const primeiroDigito = this.calculoModulo10(this.linhaDigitavel.slice(0, 9), 2);
    const segundoDigito = this.calculoModulo10(this.linhaDigitavel.slice(10, 20), 1);
    const terceiroDigito = this.calculoModulo10(this.linhaDigitavel.slice(21, 31), 1);

    if (primeiroDigito !== Number(this.linhaDigitavel[9]))
      throw new CodigoInvalidoError('boleto', 'erro no digito verificador 1.');

    if (segundoDigito !== Number(this.linhaDigitavel[20]))
      throw new CodigoInvalidoError('boleto', 'erro no digito verificador 2.');

    if (terceiroDigito !== Number(this.linhaDigitavel[31]))
      throw new CodigoInvalidoError('boleto', 'erro no digito verificador 3.');
  }

  validarDigitoVerificadorPrincipal() {
    if (this.barCode[4] !== this.linhaDigitavel[32]) throw new CodigoInvalidoError('Digito verificador principal');
  }
}
