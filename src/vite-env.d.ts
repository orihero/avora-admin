/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPWRITE_ENDPOINT: string
  readonly VITE_APPWRITE_PROJECT_ID: string
  readonly VITE_APPWRITE_DATABASE_ID: string
  readonly VITE_APPWRITE_AUCTIONS_COLLECTION_ID: string
  readonly VITE_APPWRITE_VARIABLES_COLLECTION_ID: string
  readonly VITE_APPWRITE_PRODUCTS_COLLECTION_ID: string
  readonly VITE_APPWRITE_AUCTION_PRODUCTS_COLLECTION_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
