import type { Failure } from './failures'

/**
 * Result type for explicit success/failure handling.
 * Repositories and use cases return Promise<Result<T, E>>.
 */
export type Result<T, E = Failure> =
  | { success: true; data: T }
  | { success: false; error: E }

export const Result = {
  ok<T>(data: T): Result<T, never> {
    return { success: true, data }
  },

  fail<E>(error: E): Result<never, E> {
    return { success: false, error }
  },
}
