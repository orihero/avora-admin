import { Result, ValidationFailure, type Failure } from '@/core/error'
import type { AuthRepository, LoginParams } from '../repositories'
import type { LoginResult } from '../entities'

export const AUTH_REPOSITORY_TOKEN = Symbol('AuthRepository')

export class LoginUseCase {
  constructor(private readonly authRepo: AuthRepository) {}

  async execute(params: LoginParams): Promise<Result<LoginResult, Failure>> {
    if (!params.email.includes('@')) {
      return Result.fail(new ValidationFailure('Invalid email'))
    }
    return this.authRepo.login(params)
  }
}
