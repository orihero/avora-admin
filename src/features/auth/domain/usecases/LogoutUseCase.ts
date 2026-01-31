import type { Result, Failure } from '@/core/error'
import type { AuthRepository } from '../repositories'

export class LogoutUseCase {
  constructor(private readonly authRepo: AuthRepository) {}

  async execute(): Promise<Result<void, Failure>> {
    return this.authRepo.logout()
  }
}
