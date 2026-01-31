import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLogin } from '../hooks'
import { useAuthStore } from '../stores'
import { cn } from '@/core/components'

const inputBase =
  'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500'

export function LoginForm() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberDevice, setRememberDevice] = useState(true)
  const login = useLogin()
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          setAuth(data.token, data.profile)
          navigate('/', { replace: true })
        },
      }
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-5"
      noValidate
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('auth.welcome')}</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('auth.subtitle')}</p>
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-900 dark:text-slate-100">
          {t('auth.email')}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.email')}
            className={inputBase}
            autoComplete="email"
            aria-label={t('auth.email')}
            required
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-900 dark:text-slate-100">
          {t('auth.password')}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.password')}
            className={inputBase}
            autoComplete="current-password"
            aria-label={t('auth.password')}
            required
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={rememberDevice}
            onChange={(e) => setRememberDevice(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800"
            aria-label={t('auth.rememberDevice')}
          />
          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{t('auth.rememberDevice')}</span>
        </label>
        <Link
          to="#"
          className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
        >
          {t('auth.forgotPassword')}
        </Link>
      </div>

      {login.isError && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {(login.error as Error & { code?: string }).code === 'ACCESS_DENIED'
            ? t('auth.accessDeniedAdminOnly')
            : (login.error as Error).message}
        </div>
      )}
      {login.isSuccess && (
        <p className="text-sm text-green-600" role="status">
          {t('auth.loginSuccess')}
        </p>
      )}

      <button
        type="submit"
        disabled={login.isPending}
        className={cn(
          'w-full rounded-lg bg-gradient-to-b from-orange-500 to-orange-700 px-4 py-3 text-sm font-semibold text-white shadow-sm',
          'hover:from-orange-600 hover:to-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none'
        )}
        aria-busy={login.isPending}
      >
        {login.isPending ? t('auth.signingIn') : t('auth.signIn')}
      </button>
    </form>
  )
}
