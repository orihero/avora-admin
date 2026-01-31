import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopHeader } from './TopHeader'

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Sidebar collapsed={sidebarCollapsed} />
      <div
        className={`flex min-h-screen flex-col transition-[padding] duration-200 ${sidebarCollapsed ? 'pl-16' : 'pl-64'}`}
      >
        <TopHeader onMenuClick={() => setSidebarCollapsed((prev) => !prev)} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
