import type { Result } from '@/core/error'
import type { Failure } from '@/core/error'
import type { Category } from '../entities'

export interface ListCategoriesResult {
  categories: Category[]
  total: number
}

export interface CategoryRepository {
  list(): Promise<Result<ListCategoriesResult, Failure>>
}
