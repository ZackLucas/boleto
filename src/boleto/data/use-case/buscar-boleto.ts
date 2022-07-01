import { InvalidParamError } from '@/core/domain';
import { BoletoBancario, BoletoConcessionario } from '@/boleto/domain';

export class BuscarBoleto {
  constructor() {}

  async execute(linha: string): Promise<BoletoBancario | BoletoConcessionario> {
    const replacedLinha = linha.replace(/[^a-z0-9]/gi, '');

    const length = replacedLinha.length;
    if (length < 47 || length > 48) {
      throw new InvalidParamError('linha digitada', 'Numero de caracteres deve ser 47 ou 48');
    }

    if (length === 47) return new BoletoBancario(replacedLinha);

    return new BoletoConcessionario(replacedLinha)
  }
}
