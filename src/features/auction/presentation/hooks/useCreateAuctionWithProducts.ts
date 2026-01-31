import { useMutation, useQueryClient } from '@tanstack/react-query'
import { container } from '@/di/container'
import { AUCTION_REPOSITORY_TOKEN, AUCTION_PRODUCT_REPOSITORY_TOKEN } from '@/di/container'
import type {
  AuctionRepository,
  AuctionProductRepository,
  CreateAuctionParams,
  CreateAuctionProductParams,
} from '@/features/auction/domain/repositories'

/** Row for the drawer: same as CreateAuctionProductParams but auctionId is set by the hook. */
export type CreateAuctionProductRow = Omit<CreateAuctionProductParams, 'auctionId'>

export interface CreateAuctionWithProductsParams {
  auction: CreateAuctionParams
  products: CreateAuctionProductRow[]
}

async function createAuctionWithProductsMutation(params: CreateAuctionWithProductsParams) {
  const auctionRepo = container.resolve<AuctionRepository>(AUCTION_REPOSITORY_TOKEN)
  const auctionProductRepo = container.resolve<AuctionProductRepository>(
    AUCTION_PRODUCT_REPOSITORY_TOKEN
  )

  const auctionResult = await auctionRepo.create(params.auction)
  if (!auctionResult.success) throw new Error(auctionResult.error.message)
  const auction = auctionResult.data

  if (params.products.length > 0) {
    const rows: CreateAuctionProductParams[] = params.products.map((row) => ({
      ...row,
      auctionId: auction.id,
    }))
    const productsResult = await auctionProductRepo.createMany(rows)
    if (!productsResult.success) throw new Error(productsResult.error.message)
  }

  return auction
}

export function useCreateAuctionWithProducts() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAuctionWithProductsMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] })
    },
  })
}
