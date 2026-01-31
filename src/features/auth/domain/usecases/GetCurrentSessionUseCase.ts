import type { Result, Failure } from '@/core/error'
import type { AuthRepository } from '../repositories'
import type { LoginResult } from '../entities'

export class GetCurrentSessionUseCase {
  constructor(private readonly authRepo: AuthRepository) {}

  async execute(): Promise<Result<LoginResult | null, Failure>> {
    return this.authRepo.getCurrentSession()
  }
}
