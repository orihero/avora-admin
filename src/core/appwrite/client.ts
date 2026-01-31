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

/** Database and collection IDs (from .env) */
export const AVORA_DATABASE_ID = databaseId!
export const AUCTIONS_COLLECTION_ID = auctionsCollectionId!
export const VARIABLES_COLLECTION_ID = variablesCollectionId!
export const PRODUCTS_COLLECTION_ID = productsCollectionId!
export const AUCTION_PRODUCTS_COLLECTION_ID = auctionProductsCollectionId!
export const VOTES_COLLECTION_ID = votesCollectionId!
export const PARTICIPATION_REQUESTS_COLLECTION_ID = participationRequestsCollectionId!
export const BIDS_COLLECTION_ID = bidsCollectionId!
export const WINNER_CONFIRMATION_COLLECTION_ID = winnerConfirmationCollectionId!