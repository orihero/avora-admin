import { useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconifyIcon, Logo, cn } from '@/core/components'
import { useLogout } from '@/features/auth/presentation/hooks'
import { useAuthStore } from '@/features/auth/presentation/stores'
import { getProfileDisplayName, getProfileRoleLabel } from '@/features/auth/presentation/utils'
import { useFeaturedAuction } from '@/features/auction/presentation/hooks'
import { sidebarNav } from './sidebarNav'
import type { NavGroup } from './sidebarNav'

function SidebarProfileAvatar({ avatarUrl }: { avatarUrl?: string | null }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className="h-full w-full object-cover"
      />
    )
  }
  return (
    <IconifyIcon
      icon="material-symbols:person-outline"
      className="h-6 w-6 text-black dark:text-slate-200"
    />
  )
}

function NavBadge({
  item,
  collapsed,
}: {
  item: (typeof sidebarNav)[0]['items'][0]
  collapsed: boolean
}) {
  if (collapsed) return null
  const { badge } = item
  if (badge == null) return null

  if (badge === 'Outline') {
    return (
      <span className="ml-auto rounded-full border border-sidebar-badge px-2.5 py-0.5 text-xs font-medium text-sidebar-badge">
        Outline
      </span>
    )
  }
  if (badge === 'New') {
    return (
      <span className="ml-auto rounded-full bg-sidebar-badge-muted px-2.5 py-0.5 text-xs font-medium text-sidebar-badge">
        New
      </span>
    )
  }
  if (typeof badge === 'number') {
    return (
      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-badge px-1.5 text-xs font-medium text-white">
        {badge}
      </span>
    )
  }
  return null
}

function isNavItemActive(path: string, pathname: string): boolean {
  if (path === '/') {
    return pathname === '/' || pathname === '/dashboard'
  }
  if (path.startsWith('/auction/')) {
    return pathname === path
  }
  return pathname === path
}

interface SidebarProps {
  collapsed?: boolean
}

const ONGOING_AUCTION_GROUP_LABEL = 'nav.groupOngoingAuction'

export function Sidebar({ collapsed = false }: SidebarProps) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const profile = useAuthStore((s) => s.profile)
  const logout = useLogout()
  const { auction: featuredAuction } = useFeaturedAuction()

  const navGroups = useMemo((): NavGroup[] => {
    if (!featuredAuction) return sidebarNav
    const ongoingGroup: NavGroup = {
      label: ONGOING_AUCTION_GROUP_LABEL,
      items: [
        {
          label: featuredAuction.title,
          labelRaw: featuredAuction.title,
          icon: 'hugeicons:auction',
          path: `/auction/${featuredAuction.id}`,
        },
        {
          label: 'nav.participationRequests',
          icon: 'material-symbols:person-add-outline',
          path: `/auction/${featuredAuction.id}/participation-requests`,
        },
      ],
    }
    const [firstGroup, ...restGroups] = sidebarNav
    return [firstGroup, ongoingGroup, ...restGroups]
  }, [featuredAuction])

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-shrink-0 flex-col bg-white border-r border-slate-200 transition-all duration-200 dark:bg-slate-900 dark:border-slate-700',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header / Branding */}
      <div
        className={cn(
          'flex h-16 items-center border-b border-slate-200 dark:border-slate-700',
          collapsed ? 'justify-center px-0' : 'gap-3 px-6'
        )}
      >
        <Logo showLabel={!collapsed} />
      </div>

      {/* Navigation */}
      <nav
        className={cn(
          'flex-1 overflow-y-auto py-5',
          collapsed ? 'px-2' : 'px-4'
        )}
      >
        {navGroups.map((group) => (
          <div key={group.label} className={cn(collapsed ? 'mb-4' : 'mb-6')}>
            {!collapsed && (
              <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-black dark:text-slate-300">
                {t(group.label)}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isNavItemActive(item.path, pathname)
                const displayLabel = item.labelRaw ?? t(item.label)
                return (
                  <li key={`${group.label}-${item.path}`} className="w-full">
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      title={collapsed ? displayLabel : undefined}
                      aria-label={collapsed ? displayLabel : undefined}
                      className={cn(
                        'flex w-full items-center rounded-lg text-sm font-medium transition-colors',
                        collapsed
                          ? 'justify-center px-0 py-2.5'
                          : 'gap-3 px-3 py-2.5',
                        active
                          ? 'bg-primary-600 text-white dark:bg-primary-500'
                          : 'text-black hover:bg-slate-100 hover:text-black dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                      )}
                    >
                      <IconifyIcon
                        icon={item.icon}
                        className="h-5 w-5 flex-shrink-0"
                      />
                      {!collapsed && (
                        <>
                          <span className="min-w-0 flex-1 truncate">
                            {displayLabel}
                          </span>
                          {item.hasDropdown && (
                            <IconifyIcon
                              icon="material-symbols:keyboard-arrow-down-outline"
                              className="h-5 w-5 flex-shrink-0 opacity-70"
                            />
                          )}
                          <NavBadge item={item} collapsed={collapsed} />
                        </>
                      )}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User profile card */}
      <div
        className={cn(
          'border-t border-slate-200 dark:border-slate-700',
          collapsed ? 'p-2' : 'p-4'
        )}
      >
        <div
          className={cn(
            'flex items-center rounded-xl border border-sidebar-profile-border bg-sidebar-profile dark:border-slate-600 dark:bg-slate-800',
            collapsed
              ? 'justify-center p-2'
              : 'gap-3 px-4 py-3'
          )}
        >
          {collapsed ? (
            <button
              type="button"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-300 transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-slate-600"
              aria-label={t('common.signOut')}
              title={t('common.signOut')}
            >
              <SidebarProfileAvatar avatarUrl={profile?.avatarUrl ?? null} />
            </button>
          ) : (
            <>
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-300 dark:bg-slate-600">
                <SidebarProfileAvatar avatarUrl={profile?.avatarUrl ?? null} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-black dark:text-slate-100">
                  {getProfileDisplayName(profile)}
                </p>
                <p className="truncate text-xs text-slate-600 dark:text-slate-400">{getProfileRoleLabel(profile)}</p>
              </div>
              <button
                type="button"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sidebar-badge transition-colors hover:bg-sidebar-badge-muted hover:text-sidebar-badge disabled:opacity-50"
                aria-label={t('common.signOut')}
              >
                <IconifyIcon
                  icon="material-symbols:power-settings-new-outline"
                  className="h-5 w-5"
                />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
