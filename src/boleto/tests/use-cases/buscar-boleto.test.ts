import { BuscarBoleto } from '@/boleto/data'
import { BadRequestError, InvalidParamError } from '@/core/domain'

type MakeSut = {
  sut: BuscarBoleto
}

const makeSut = (): MakeSut => {
  const buscarBoleto = new BuscarBoleto()

  return { sut: buscarBoleto }
}

describe('Testes do buscar boleto', () => {
  it('Deve encontrar os dados de um "boleto bancario"', async () => {
    const { sut } = makeSut()
    const boleto = '36490.00019 00004.361804 00001.020676 9 88610000009990'

    const { amount, expirationDate, barCode } = await sut.execute(boleto)

    expect(amount).toStrictEqual(9990)
    expect(expirationDate).toStrictEqual('2022-01-10')
    expect(barCode).toStrictEqual('36499886100000099900000100004361800000102067')
  })

  it('Deve encontrar os dados de um "boleto concessionario"', async () => {
    const { sut } = makeSut()
    const boleto = '82630000000-5 75460097091-9 01486674045-0 21377422963-6'

    const { amount, expirationDate, barCode } = await sut.execute(boleto)

    expect(amount).toStrictEqual(7546)
    expect(expirationDate).toStrictEqual('não especificado.')
    expect(barCode).toStrictEqual('82630000000754600970910148667404521377422963')
  })

  it('Deve retornar uma exceção - linha digitada fora dos padrões', async () => {
    const { sut } = makeSut()
    const boleto = '123123123'

    await expect(sut.execute(boleto)).rejects.toThrow(InvalidParamError)
  })

  it('Deve retornar uma exceção "boleto bancario" - digito verificador 1 incorreto', async () => {
    const { sut } = makeSut()
    const boleto = '21290011192110001210904475617405975870000002000'

    await expect(sut.execute(boleto)).rejects.toThrow(BadRequestError)
  })

  it('Deve retornar uma exceção em "boleto bancario" - digito verificador 2 incorreto', async () => {
    const { sut } = makeSut()
    const boleto = '21290001192110001210204475617405975870000002000'

    await expect(sut.execute(boleto)).rejects.toThrow(BadRequestError)
  })

  it('Deve retornar uma exceção em "boleto bancario" - digito verificador 3 incorreto', async () => {
    const { sut } = makeSut()
    const boleto = '21290001192110001210904455617405975870000002000'

    await expect(sut.execute(boleto)).rejects.toThrow(BadRequestError)
  })

  it('Deve retornar uma exceção em "boleto bancario" - digito verificador principal incorreto', async () => {
    const { sut } = makeSut()
    const boleto = '36490.00035 00004.361804 00001.020668 1 88300000009991'

    await expect(sut.execute(boleto)).rejects.toThrow(BadRequestError)
  })

  it('Deve retornar uma exceção em "boleto concessionario" - digito verificador 1 incorreto', async () => {
    const { sut } = makeSut()
    const boleto = '82630000000-0 75460097091-9 01486674045-0 21377422963-6'

    await expect(sut.execute(boleto)).rejects.toThrow(BadRequestError)
  })

  it('Deve retornar uma exceção em "boleto concessionario" - digito verificador 2 incorreto', async () => {
    const { sut } = makeSut()
    const boleto = '82630000000-5 75460097091-2 01486674045-0 21377422963-6'

    await expect(sut.execute(boleto)).rejects.toThrow(BadRequestError)
  })

  it('Deve retornar uma exceção em "boleto concessionario" - digito verificador 3 incorreto', async () => {
    const { sut } = makeSut()
    const boleto = '82630000000-5 75460097091-9 01486674045-4 21377422963-6'

    await expect(sut.execute(boleto)).rejects.toThrow(BadRequestError)
  })

  it('Deve retornar uma exceção em "boleto concessionario" - digito verificador 4 incorreto', async () => {
    const { sut } = makeSut()
    const boleto = '82630000000-5 75460097091-9 01486674045-0 21377422963-8'

    await expect(sut.execute(boleto)).rejects.toThrow(BadRequestError)
  })
})
