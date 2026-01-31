import type { ProjectData } from '@/features/dashboard/domain/entities/DashboardData'
import { IconifyIcon } from '@/core/components'
import { cn } from '@/core/components'

const priorityColors: Record<ProjectData['priority'], string> = {
  Low: 'bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-200',
  Medium: 'bg-amber-100 text-amber-800',
  High: 'bg-orange-100 text-orange-800',
  Critical: 'bg-red-100 text-red-800',
}

interface TopProjectsTableProps {
  projects: ProjectData[]
}

export function TopProjectsTable({ projects }: TopProjectsTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Top Projects</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500 dark:border-slate-600 dark:text-slate-400">
              <th className="pb-3 font-medium">Assigned</th>
              <th className="pb-3 font-medium">Project</th>
              <th className="pb-3 font-medium">Priority</th>
              <th className="pb-3 font-medium">Budget</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-100 last:border-0 dark:border-slate-700"
              >
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 dark:bg-slate-600">
                      {row.assigned.avatar ? (
                        <img
                          src={row.assigned.avatar}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <IconifyIcon
                          icon="material-symbols:person"
                          className="h-5 w-5 text-slate-600 dark:text-slate-400"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {row.assigned.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {row.assigned.role}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-slate-700 dark:text-slate-300">{row.project}</td>
                <td className="py-3">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                      priorityColors[row.priority]
                    )}
                  >
                    {row.priority}
                  </span>
                </td>
                <td className="py-3 font-medium text-slate-700 dark:text-slate-300">
                  {row.budget}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
