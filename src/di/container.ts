import 'reflect-metadata'
import { container } from 'tsyringe'
import type { AuthRepository } from '@/features/auth/domain/repositories'
import { AuthRepositoryImpl } from '@/features/auth/data/repositories'
import { AppwriteAuthDatasource } from '@/features/auth/data/datasources'
import { LoginUseCase, LogoutUseCase, GetCurrentSessionUseCase, AUTH_REPOSITORY_TOKEN } from '@/features/auth/domain/usecases'
import type { DashboardRepository } from '@/features/dashboard/domain/repositories/DashboardRepository'
import { DashboardRepositoryImpl } from '@/features/dashboard/data/repositories/DashboardRepositoryImpl'
import type { AuctionRepository } from '@/features/auction/domain/repositories'
import { AuctionRepositoryImpl } from '@/features/auction/data/repositories'
import { AppwriteAuctionDataSource } from '@/features/auction/data/datasources'
import type { VariablesRepository } from '@/features/settings/domain/repositories'
import { VariablesRepositoryImpl } from '@/features/settings/data/repositories'
import { AppwriteVariablesDataSource } from '@/features/settings/data/datasources'
import type { ProductRepository } from '@/features/products/domain/repositories'
import { ProductRepositoryImpl } from '@/features/products/data/repositories'
import { AppwriteProductDataSource } from '@/features/products/data/datasources'
import type { CategoryRepository } from '@/features/categories/domain/repositories'
import { CategoryRepositoryImpl } from '@/features/categories/data/repositories'
import { AppwriteCategoryDataSource } from '@/features/categories/data/datasources'
import type {
  AuctionProductRepository,
  AuctionStatsRepository,
  ParticipationRequestRepository,
} from '@/features/auction/domain/repositories'
import {
  AuctionProductRepositoryImpl,
  AuctionStatsRepositoryImpl,
  ParticipationRequestRepositoryImpl,
} from '@/features/auction/data/repositories'
import {
  AppwriteAuctionProductDataSource,
  AppwriteBidsDataSource,
  AppwriteParticipationRequestDataSource,
  AppwriteVotesDataSource,
  AppwriteWinnerConfirmationDataSource,
} from '@/features/auction/data/datasources'
import type { UserProfileRepository } from '@/features/users/domain/repositories'
import { UserProfileRepositoryImpl } from '@/features/users/data/repositories'
import { AppwriteUserProfileDataSource } from '@/features/users/data/datasources'

export const AUCTION_REPOSITORY_TOKEN = 'AuctionRepository'
export const USER_PROFILE_REPOSITORY_TOKEN = 'UserProfileRepository'
export const VARIABLES_REPOSITORY_TOKEN = 'VariablesRepository'
export const PRODUCT_REPOSITORY_TOKEN = 'ProductRepository'
export const CATEGORY_REPOSITORY_TOKEN = 'CategoryRepository'
export const AUCTION_PRODUCT_REPOSITORY_TOKEN = 'AuctionProductRepository'
export const PARTICIPATION_REQUEST_REPOSITORY_TOKEN = 'ParticipationRequestRepository'
export const AUCTION_STATS_REPOSITORY_TOKEN = 'AuctionStatsRepository'

container.registerSingleton(AppwriteAuthDatasource)

container.register<AuthRepository>(AUTH_REPOSITORY_TOKEN, {
  useFactory: (c) => new AuthRepositoryImpl(c.resolve(AppwriteAuthDatasource)),
})

container.register(LoginUseCase, {
  useFactory: (c) => new LoginUseCase(c.resolve<AuthRepository>(AUTH_REPOSITORY_TOKEN)),
})

container.register(LogoutUseCase, {
  useFactory: (c) => new LogoutUseCase(c.resolve<AuthRepository>(AUTH_REPOSITORY_TOKEN)),
})

container.register(GetCurrentSessionUseCase, {
  useFactory: (c) => new GetCurrentSessionUseCase(c.resolve<AuthRepository>(AUTH_REPOSITORY_TOKEN)),
})

container.register<DashboardRepository>('DashboardRepository', {
  useClass: DashboardRepositoryImpl,
})

container.registerSingleton(AppwriteAuctionDataSource)
container.register<AuctionRepository>(AUCTION_REPOSITORY_TOKEN, {
  useFactory: (c) => new AuctionRepositoryImpl(c.resolve(AppwriteAuctionDataSource)),
})

container.registerSingleton(AppwriteVariablesDataSource)
container.register<VariablesRepository>(VARIABLES_REPOSITORY_TOKEN, {
  useFactory: (c) => new VariablesRepositoryImpl(c.resolve(AppwriteVariablesDataSource)),
})

container.registerSingleton(AppwriteProductDataSource)
container.register<ProductRepository>(PRODUCT_REPOSITORY_TOKEN, {
  useFactory: (c) => new ProductRepositoryImpl(c.resolve(AppwriteProductDataSource)),
})

container.registerSingleton(AppwriteCategoryDataSource)
container.register<CategoryRepository>(CATEGORY_REPOSITORY_TOKEN, {
  useFactory: (c) => new CategoryRepositoryImpl(c.resolve(AppwriteCategoryDataSource)),
})

container.registerSingleton(AppwriteUserProfileDataSource)
container.register<UserProfileRepository>(USER_PROFILE_REPOSITORY_TOKEN, {
  useFactory: (c) =>
    new UserProfileRepositoryImpl(c.resolve(AppwriteUserProfileDataSource)),
})

container.registerSingleton(AppwriteAuctionProductDataSource)
container.register<AuctionProductRepository>(AUCTION_PRODUCT_REPOSITORY_TOKEN, {
  useFactory: (c) =>
    new AuctionProductRepositoryImpl(c.resolve(AppwriteAuctionProductDataSource)),
})

container.registerSingleton(AppwriteParticipationRequestDataSource)
container.register<ParticipationRequestRepository>(PARTICIPATION_REQUEST_REPOSITORY_TOKEN, {
  useFactory: (c) =>
    new ParticipationRequestRepositoryImpl(c.resolve(AppwriteParticipationRequestDataSource)),
})

container.registerSingleton(AppwriteVotesDataSource)
container.registerSingleton(AppwriteBidsDataSource)
container.registerSingleton(AppwriteWinnerConfirmationDataSource)
container.register<AuctionStatsRepository>(AUCTION_STATS_REPOSITORY_TOKEN, {
  useFactory: (c) =>
    new AuctionStatsRepositoryImpl(
      c.resolve(AppwriteVotesDataSource),
      c.resolve(AppwriteParticipationRequestDataSource),
      c.resolve(AppwriteBidsDataSource),
      c.resolve(AppwriteWinnerConfirmationDataSource)
    ),
})

export { container }
