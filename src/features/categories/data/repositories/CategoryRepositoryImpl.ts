import { Result, ValidationFailure, ServerFailure } from '@/core/error'
import type { CategoryRepository, ListCategoriesResult } from '@/features/categories/domain/repositories'
import { mapCategoryRowDTOToEntity } from '@/features/categories/data/mappers'
import { CategoryRowDTOSchema } from '@/features/categories/data/dto'
import { AppwriteCategoryDataSource } from '@/features/categories/data/datasources'

export class CategoryRepositoryImpl implements CategoryRepository {
  constructor(private readonly dataSource: AppwriteCategoryDataSource) {}

  async list(): Promise<Result<ListCategoriesResult, ValidationFailure | ServerFailure>> {
    try {
      const response = await this.dataSource.listRows()
      const categories: ListCategoriesResult['categories'] = []
      for (const row of response.rows) {
        const parsed = CategoryRowDTOSchema.safeParse(row)
        if (!parsed.success) {
          return Result.fail(
            new ValidationFailure(`Invalid category row ${row.$id}: ${parsed.error.message}`)
          )
        }
        categories.push(mapCategoryRowDTOToEntity(parsed.data))
      }
      return Result.ok({ categories, total: response.total })
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to list categories'
      return Result.fail(new ServerFailure(message))
    }
  }
}
