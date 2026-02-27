export interface NavItem {
  label: string
  icon: string
  path: string
  /** When set, display this instead of t(label) (e.g. dynamic auction title) */
  labelRaw?: string
  /** Pill badge text (e.g. "New") or numeric count for circular badge */
  badge?: string | number
  /** Show dropdown chevron */
  hasDropdown?: boolean
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const sidebarNav: NavGroup[] = [
  {
    label: 'nav.groupDashboard',
    items: [
      {
        label: 'nav.analytics',
        icon: 'mage:dashboard-bar',
        path: '/',
      },
    ],
  },
  {
    label: 'nav.groupData',
    items: [
      {
        label: 'nav.auction',
        icon: 'hugeicons:auction',
        path: '/auction',
      },
      {
        label: 'nav.categories',
        icon: 'tabler:category',
        path: '/categories',
      },
      {
        label: 'nav.products',
        icon: 'tabler:package',
        path: '/products',
      },
      {
        label: 'nav.users',
        icon: 'hugeicons:user',
        path: '/users',
      },
    ],
  },
  {
    label: 'nav.groupSettings',
    items: [
      {
        label: 'nav.systemConfigurations',
        icon: 'material-symbols:settings',
        path: '/settings/system-configurations',
      },
    ],
  },
]
