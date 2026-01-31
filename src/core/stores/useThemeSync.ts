import { useEffect, useSyncExternalStore } from 'react'
import { useThemeStore } from './themeStore'

function resolveDark(theme: 'light' | 'dark' | 'system'): boolean {
  if (theme === 'dark') return true
  if (theme === 'light') return false
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function subscribeToResolvedDark(cb: () => void) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

/** Returns whether the UI is currently in dark mode (resolves 'system' via prefers-color-scheme). */
export function useResolvedDark(): boolean {
  const theme = useThemeStore((state) => state.theme)
  const systemDark = useSyncExternalStore(
    subscribeToResolvedDark,
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
    () => false
  )
  if (theme === 'dark') return true
  if (theme === 'light') return false
  return systemDark
}

export function useThemeSync() {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    const root = document.documentElement

    const apply = (isDark: boolean) => {
      if (isDark) root.classList.add('dark')
      else root.classList.remove('dark')
    }

    apply(resolveDark(theme))

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const listener = () => apply(mq.matches)
      mq.addEventListener('change', listener)
      return () => mq.removeEventListener('change', listener)
    }
  }, [theme])
}
