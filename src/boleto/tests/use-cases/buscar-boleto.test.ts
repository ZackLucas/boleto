import { BuscarBoleto } from '@/boleto/data'
import { BadRequestError } from '@/core/domain'

type MakeSut = {
  sut: BuscarBoleto
}

const makeSut = (): MakeSut => {
  const buscarBoleto = new BuscarBoleto()

  return { sut: buscarBoleto }
}

describe('Testes do buscar boleto', () => {
  it('Should be able to find informations from "boleto bancario"', async () => {
    const { sut } = makeSut()
    const boleto = '21290001192110001210904475617405975870000002000'

    const { amount, expirationDate, barCode } = await sut.execute(boleto)

    expect(amount).toStrictEqual(2000)
    expect(expirationDate).toStrictEqual('2018-07-16')
    expect(barCode).toStrictEqual('21299758700000020000001121100012100447561740')
  })

  it('Should be able to find informations from "boleto concessionario"', async () => {
    const { sut } = makeSut()
    const boleto = '826300000005754600970919014866740450213774229636'

    const { amount, expirationDate, barCode } = await sut.execute(boleto)

    expect(amount).toStrictEqual(7546)
    expect(expirationDate).toStrictEqual('não especificado.')
    expect(barCode).toStrictEqual('82630000000754600970910148667404521377422963')
  })

  it('Should not be able to find informations from "boleto bancario" - verify digit 1 incorrect', async () => {
    const { sut } = makeSut()
    const boleto = '21290011192110001210904475617405975870000002000'

    await expect(sut.execute(boleto)).rejects.toThrow(BadRequestError)
  })

  it('Should not be able to find informations from "boleto bancario" - verify digit 2 incorrect', async () => {
    const { sut } = makeSut()
    const boleto = '21290001192110001210204475617405975870000002000'

    await expect(sut.execute(boleto)).rejects.toThrow(BadRequestError)
  })

  it('Should not be able to find informations from "boleto bancario" - verify digit 3 incorrect', async () => {
    const { sut } = makeSut()
    const boleto = '21290001192110001210904455617405975870000002000'

    await expect(sut.execute(boleto)).rejects.toThrow(BadRequestError)
  })
})
