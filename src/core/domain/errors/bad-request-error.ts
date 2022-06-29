export class BadRequestError extends Error {
  constructor(private readonly param: string, private readonly errorMessage: string) {
    super(errorMessage)
    this.name = 'BadRequestError'
  }
}
