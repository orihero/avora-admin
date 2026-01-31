import type { Result } from '@/core/error'
import type { Failure } from '@/core/error'
import type { Variable } from '../entities'

export interface ListVariablesResult {
  variables: Variable[]
  total: number
}

export interface VariablesRepository {
  list(): Promise<Result<ListVariablesResult, Failure>>
}
