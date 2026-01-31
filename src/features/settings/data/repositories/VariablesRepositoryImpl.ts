import { Result, ValidationFailure, ServerFailure } from '@/core/error'
import type { VariablesRepository, ListVariablesResult } from '@/features/settings/domain/repositories'
import { mapVariableDocumentDTOToEntity } from '@/features/settings/data/mappers'
import { VariableDocumentDTOSchema } from '@/features/settings/data/dto'
import { AppwriteVariablesDataSource } from '@/features/settings/data/datasources'

export class VariablesRepositoryImpl implements VariablesRepository {
  constructor(private readonly dataSource: AppwriteVariablesDataSource) {}

  async list(): Promise<Result<ListVariablesResult, ValidationFailure | ServerFailure>> {
    try {
      const response = await this.dataSource.listDocuments()
      const variables: ListVariablesResult['variables'] = []
      for (const doc of response.documents) {
        const parsed = VariableDocumentDTOSchema.safeParse(doc)
        if (!parsed.success) {
          return Result.fail(
            new ValidationFailure(`Invalid variable document ${doc.$id}: ${parsed.error.message}`)
          )
        }
        variables.push(mapVariableDocumentDTOToEntity(parsed.data))
      }
      return Result.ok({ variables, total: response.total })
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to list variables'
      return Result.fail(new ServerFailure(message))
    }
  }
}
