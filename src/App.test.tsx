import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

const queryClient = new QueryClient()

function renderWithProviders(ui: React.ReactElement, initialEntries = ['/']) {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('App', () => {
  it('renders main layout with brand', () => {
    renderWithProviders(<App />)
    expect(screen.getByText('Modernize')).toBeInTheDocument()
  })

  it('renders login form', () => {
    renderWithProviders(<App />, ['/login'])
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })
})
