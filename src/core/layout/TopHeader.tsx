import { useState, useRef, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'
import { useLogout } from '@/features/auth/presentation/hooks'
import { useAuthStore } from '@/features/auth/presentation/stores'
import { getProfileDisplayName, getProfileRoleLabel } from '@/features/auth/presentation/utils'
import { useThemeStore, useResolvedDark } from '@/core/stores'
import { cn } from '@/core/components'

const LANGUAGES = [
  { code: 'en', label: 'English', icon: 'circle-flags:us' },
  { code: 'ru', label: 'Русский', icon: 'circle-flags:ru' },
  { code: 'uz', label: "O'zbekcha", icon: 'circle-flags:uz' },
] as const

interface TopHeaderProps {
  onMenuClick?: () => void
}

export function TopHeader({ onMenuClick }: TopHeaderProps) {
  const { t, i18n } = useTranslation()
  const [profileOpen, setProfileOpen] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const langDropdownRef = useRef<HTMLDivElement>(null)
  const profile = useAuthStore((s) => s.profile)
  const logout = useLogout()
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const isDark = useResolvedDark()

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false)
      }
    }
    if (profileOpen || langDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [profileOpen, langDropdownOpen])

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-700 dark:bg-slate-900">
      {/* Left: menu, search */}
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          aria-label={t('common.toggleSidebar')}
        >
          <Icon icon="material-symbols:menu" className="h-6 w-6" />
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          aria-label={t('common.search')}
        >
          <Icon icon="material-symbols:search" className="h-5 w-5" />
        </button>
      </div>

      {/* Right: language, dark mode, profile */}
      <div className="flex items-center gap-1">
        <div className="relative" ref={langDropdownRef}>
          <button
            type="button"
            onClick={() => setLangDropdownOpen((prev) => !prev)}
            className={cn(
              'flex h-9 items-center gap-1.5 rounded-lg px-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100',
              langDropdownOpen && 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
            )}
            aria-label={t('common.language')}
            aria-expanded={langDropdownOpen}
            aria-haspopup="true"
          >
            <Icon icon={currentLang.icon} className="h-5 w-5 flex-shrink-0" />
            <span className="hidden max-w-[6rem] truncate text-sm font-medium sm:inline">{currentLang.label}</span>
          </button>
          {langDropdownOpen && (
            <div
              className="absolute right-0 top-full z-50 mt-2 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800"
              role="menu"
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    i18n.changeLanguage(lang.code)
                    setLangDropdownOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700',
                    lang.code === i18n.language && 'bg-slate-50 font-medium text-slate-900 dark:bg-slate-700 dark:text-slate-100'
                  )}
                  role="menuitem"
                >
                  <Icon icon={lang.icon} className="h-5 w-5 flex-shrink-0" />
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={isDark}
        >
          <Icon icon={isDark ? 'carbon:sun' : 'carbon:moon'} className="h-5 w-5" />
        </button>
        <div className="relative ml-2" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            className={cn(
              'flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 bg-slate-200 transition-opacity hover:opacity-90 dark:bg-slate-600',
              profileOpen ? 'border-slate-400 ring-2 ring-slate-200 dark:border-slate-500 dark:ring-slate-600' : 'border-slate-200 dark:border-slate-600'
            )}
            aria-label={t('common.profile')}
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <Icon icon="material-symbols:person-outline" className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            )}
          </button>
          {profileOpen && (
            <div
              className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800"
              role="menu"
            >
              <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{getProfileDisplayName(profile)}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{getProfileRoleLabel(profile)}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false)
                  logout.mutate()
                }}
                disabled={logout.isPending}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-700"
                role="menuitem"
              >
                <Icon icon="material-symbols:power-settings-new-outline" className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                {logout.isPending ? t('common.signingOut') : t('common.signOut')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
