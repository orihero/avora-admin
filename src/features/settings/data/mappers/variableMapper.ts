import type { Variable } from '../../domain/entities'
import type { VariableDocumentDTO } from '../dto'

const SYSTEM_KEYS = ['$id', '$collectionId', '$databaseId', '$createdAt', '$updatedAt', '$permissions']

function getAttributes(dto: VariableDocumentDTO): Record<string, unknown> {
  const attrs: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(dto)) {
    if (!SYSTEM_KEYS.includes(key) && value !== undefined) {
      attrs[key] = value
    }
  }
  return attrs
}

export function mapVariableDocumentDTOToEntity(dto: VariableDocumentDTO): Variable {
  return {
    id: dto.$id,
    createdAt: dto.$createdAt,
    updatedAt: dto.$updatedAt,
    attributes: getAttributes(dto),
  }
}
