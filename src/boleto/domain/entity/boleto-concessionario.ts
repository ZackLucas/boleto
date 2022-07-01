import { InvalidParamError } from '@/core/domain';

import { Boleto } from './boleto'

export class BoletoConcessionario extends Boleto {
  expirationDate: Date;

  constructor(linhaDigitavel: string) {
    super(linhaDigitavel)
    this.validator();
  }

  private validator() {
    if (this.linhaDigitavel.length !== 48) {
      throw new InvalidParamError('linha digitada', 'A linha digitada deve possuir 48 números');
    }
    this.validarDigitosVerificadores();
  }

  public getBarCodeIncompleto() {
    return (
      this.linhaDigitavel.slice(0, 2) +
      this.linhaDigitavel.slice(3, 11) +
      this.linhaDigitavel.slice(12, 23) +
      this.linhaDigitavel.slice(21, 31) +
      this.linhaDigitavel.slice(32, 47)
    );
  }

  public obterCodigoDeBarra() {
    const incompleto = this.getBarCodeIncompleto();
    const digitoVerificador = this.calculoModulo11();

    return `${incompleto.slice(0, 4)}${digitoVerificador}${incompleto.slice(4)}`;
  }

  private validarDigitosVerificadores() {
    const primeiroDigito = super.calculoModulo10(this.linhaDigitavel.slice(0, 11), 2);
    const segundoDigito = super.calculoModulo10(this.linhaDigitavel.slice(12, 23), 2);
    const terceiroDigito = super.calculoModulo10(this.linhaDigitavel.slice(24, 35), 2);
    const quartoDigito = super.calculoModulo10(this.linhaDigitavel.slice(36, 47), 2);

    if (primeiroDigito !== Number(this.linhaDigitavel[11]))
      throw new InvalidParamError('boleto', 'erro no digito verificador 1.');

    if (segundoDigito !== Number(this.linhaDigitavel[23]))
      throw new InvalidParamError('boleto', 'erro no digito verificador 2.');

    if (terceiroDigito !== Number(this.linhaDigitavel[35]))
      throw new InvalidParamError('boleto', 'erro no digito verificador 3.');

    if (quartoDigito !== Number(this.linhaDigitavel[47]))
      throw new InvalidParamError('boleto', 'erro no digito verificador 4.');
  }
}
