import { databases, AVORA_DATABASE_ID, VARIABLES_COLLECTION_ID } from '@/core/appwrite/client'
import type { VariableDocumentDTO } from '../dto'

export interface AppwriteVariablesListResponse {
  total: number
  documents: VariableDocumentDTO[]
}

export class AppwriteVariablesDataSource {
  async listDocuments(): Promise<AppwriteVariablesListResponse> {
    const response = await databases.listDocuments(
      AVORA_DATABASE_ID,
      VARIABLES_COLLECTION_ID
    )
    return {
      total: response.total,
      documents: (response.documents ?? []) as VariableDocumentDTO[],
    }
  }
}
