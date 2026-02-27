import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/core/layout'
import { DashboardPage } from '@/features/dashboard/presentation'
import {
  AuctionPage,
  AuctionDetailsPage,
  ParticipationRequestsPage,
} from '@/features/auction/presentation'
import { CategoriesPage } from '@/features/categories/presentation'
import { ProductsPage } from '@/features/products/presentation'
import { UsersPage } from '@/features/users/presentation'
import { SystemConfigurationsPage } from '@/features/settings/presentation'
import {
  LoginForm,
  SignInLayout,
  ProtectedRoute,
} from '@/features/auth/presentation/components'
import { useAuthStore } from '@/features/auth/presentation/stores'

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="auction" element={<AuctionPage />} />
          <Route path="auction/:id" element={<AuctionDetailsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="auction/:id/participation-requests" element={<ParticipationRequestsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings/system-configurations" element={<SystemConfigurationsPage />} />
        </Route>
      </Route>
      <Route path="/login" element={<LoginRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function LoginRoute() {
  const sessionChecked = useAuthStore((s) => s.sessionChecked)
  const token = useAuthStore((s) => s.token)

  if (sessionChecked && token) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <SignInLayout>
      <LoginForm />
    </SignInLayout>
  )
}

export default App
