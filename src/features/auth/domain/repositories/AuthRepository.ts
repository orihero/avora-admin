import type { Result } from '@/core/error'
import type { Failure } from '@/core/error'
import type { LoginResult } from '../entities'

export interface LoginParams {
  email: string
  password: string
}

export interface AuthRepository {
  login(params: LoginParams): Promise<Result<LoginResult, Failure>>
  logout(): Promise<Result<void, Failure>>
  getCurrentSession(): Promise<Result<LoginResult | null, Failure>>
}
