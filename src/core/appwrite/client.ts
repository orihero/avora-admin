import { Client, Databases } from 'appwrite'

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID
const auctionsCollectionId = import.meta.env.VITE_APPWRITE_AUCTIONS_COLLECTION_ID
const variablesCollectionId = import.meta.env.VITE_APPWRITE_VARIABLES_COLLECTION_ID
const productsCollectionId = import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID
const auctionProductsCollectionId = import.meta.env.VITE_APPWRITE_AUCTION_PRODUCTS_COLLECTION_ID
const votesCollectionId = import.meta.env.VITE_APPWRITE_VOTES_COLLECTION_ID
const participationRequestsCollectionId =
  import.meta.env.VITE_APPWRITE_PARTICIPATION_REQUESTS_COLLECTION_ID
const bidsCollectionId = import.meta.env.VITE_APPWRITE_BIDS_COLLECTION_ID
const winnerConfirmationCollectionId =
  import.meta.env.VITE_APPWRITE_WINNER_CONFIRMATION_COLLECTION_ID

const required = [
  ['VITE_APPWRITE_ENDPOINT', endpoint],
  ['VITE_APPWRITE_PROJECT_ID', projectId],
  ['VITE_APPWRITE_DATABASE_ID', databaseId],
  ['VITE_APPWRITE_AUCTIONS_COLLECTION_ID', auctionsCollectionId],
  ['VITE_APPWRITE_VARIABLES_COLLECTION_ID', variablesCollectionId],
  ['VITE_APPWRITE_PRODUCTS_COLLECTION_ID', productsCollectionId],
  ['VITE_APPWRITE_AUCTION_PRODUCTS_COLLECTION_ID', auctionProductsCollectionId],
  ['VITE_APPWRITE_VOTES_COLLECTION_ID', votesCollectionId],
  ['VITE_APPWRITE_PARTICIPATION_REQUESTS_COLLECTION_ID', participationRequestsCollectionId],
  ['VITE_APPWRITE_BIDS_COLLECTION_ID', bidsCollectionId],
  ['VITE_APPWRITE_WINNER_CONFIRMATION_COLLECTION_ID', winnerConfirmationCollectionId],
] as const
const missing = required.filter(([, v]) => v === undefined || v === '').map(([k]) => k)
if (missing.length > 0) {
  throw new Error(`Missing required env: ${missing.join(', ')}. Copy .env.example to .env and set them.`)
}

const client = new Client().setEndpoint(endpoint!).setProject(projectId!)

export const appwriteClient = client
export const databases = new Databases(client)

/**
 * Tables DB API - for databases of type "tablesdb".
 * Uses REST path /tablesdb/{databaseId}/tables/{tableId}/rows
 * since the Databases SDK uses /databases/collections/documents which doesn't work with tablesdb.
 */
export async function tablesDbListRows<T = Record<string, unknown>>(
  databaseId: string,
  tableId: string,
  queries?: string[]
): Promise<{ total: number; rows: T[] }> {
  const apiPath = `/tablesdb/${databaseId}/tables/${tableId}/rows`
  const uri = new URL(client.config.endpoint + apiPath)
  const payload = queries?.length ? { queries } : {}
  const response = await client.call('get', uri, { 'content-type': 'application/json' }, payload)
  return {
    total: response.total ?? 0,
    rows: (response.rows ?? []) as T[],
  }
}

export async function tablesDbGetRow<T = Record<string, unknown>>(
  databaseId: string,
  tableId: string,
  rowId: string
): Promise<T | null> {
  try {
    const apiPath = `/tablesdb/${databaseId}/tables/${tableId}/rows/${rowId}`
    const uri = new URL(client.config.endpoint + apiPath)
    const response = await client.call('get', uri, { 'content-type': 'application/json' }, {})
    return response as T
  } catch (e: unknown) {
    const code = (e as { code?: number })?.code
    if (code === 404) return null
    throw e
  }
}

export async function tablesDbCreateRow<T = Record<string, unknown>>(
  databaseId: string,
  tableId: string,
  rowId: string,
  data: Record<string, unknown>
): Promise<T> {
  const apiPath = `/tablesdb/${databaseId}/tables/${tableId}/rows`
  const uri = new URL(client.config.endpoint + apiPath)
  const response = await client.call(
    'post',
    uri,
    { 'content-type': 'application/json' },
    { rowId, data }
  )
  return response as T
}

export async function tablesDbUpdateRow<T = Record<string, unknown>>(
  databaseId: string,
  tableId: string,
  rowId: string,
  data: Record<string, unknown>
): Promise<T> {
  const apiPath = `/tablesdb/${databaseId}/tables/${tableId}/rows/${rowId}`
  const uri = new URL(client.config.endpoint + apiPath)
  const response = await client.call(
    'patch',
    uri,
    { 'content-type': 'application/json' },
    { data }
  )
  return response as T
}

export async function tablesDbDeleteRow(
  databaseId: string,
  tableId: string,
  rowId: string
): Promise<void> {
  const apiPath = `/tablesdb/${databaseId}/tables/${tableId}/rows/${rowId}`
  const uri = new URL(client.config.endpoint + apiPath)
  await client.call('delete', uri, { 'content-type': 'application/json' }, {})
}

/** Database and collection IDs (from .env). Categories table id (Tables DB). */
export const AVORA_DATABASE_ID = databaseId!
export const CATEGORIES_TABLE_ID = 'categories'
/** user_profiles table/collection (Auth profile rows; authId = Appwrite Auth user $id). */
export const USER_PROFILES_COLLECTION_ID = 'user_profiles'
export const AUCTIONS_COLLECTION_ID = auctionsCollectionId!
export const VARIABLES_COLLECTION_ID = variablesCollectionId!
export const PRODUCTS_COLLECTION_ID = productsCollectionId!
export const AUCTION_PRODUCTS_COLLECTION_ID = auctionProductsCollectionId!
export const VOTES_COLLECTION_ID = votesCollectionId!
export const PARTICIPATION_REQUESTS_COLLECTION_ID = participationRequestsCollectionId!
export const BIDS_COLLECTION_ID = bidsCollectionId!
export const WINNER_CONFIRMATION_COLLECTION_ID = winnerConfirmationCollectionId!