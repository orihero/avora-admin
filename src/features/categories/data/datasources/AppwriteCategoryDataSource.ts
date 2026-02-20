import { tablesDbListRows, AVORA_DATABASE_ID, CATEGORIES_TABLE_ID } from '@/core/appwrite/client'

/** Raw row from Appwrite categories table (Tables DB). */
export interface AppwriteCategoryRow {
  $id: string
  $sequence?: number
  $createdAt: string
  $updatedAt: string
  $permissions?: string[]
  $databaseId?: string
  $tableId?: string
  name: string
}

export interface AppwriteCategoryListResponse {
  total: number
  rows: AppwriteCategoryRow[]
}

export class AppwriteCategoryDataSource {
  async listRows(): Promise<AppwriteCategoryListResponse> {
    const response = await tablesDbListRows<AppwriteCategoryRow>(
      AVORA_DATABASE_ID,
      CATEGORIES_TABLE_ID
    )
    return {
      total: response.total,
      rows: response.rows,
    }
  }
}
