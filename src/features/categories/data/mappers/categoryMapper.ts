import type { Category } from '@/features/categories/domain/entities'
import type { CategoryRowDTO } from '../dto'

export function mapCategoryRowDTOToEntity(dto: CategoryRowDTO): Category {
  return {
    id: dto.$id,
    name: dto.name,
    createdAt: dto.$createdAt,
    updatedAt: dto.$updatedAt,
  }
}
