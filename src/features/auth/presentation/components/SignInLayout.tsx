import { Logo } from '@/core/components'
import illustration from '../assets/illustration.svg'

interface SignInLayoutProps {
  children: React.ReactNode
}

export function SignInLayout({ children }: SignInLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-900 lg:flex-row">
      {/* Left column: branding + illustration */}
      <div className="flex flex-1 flex-col bg-auth-panel dark:bg-slate-800 lg:flex-[1.1]">
        <div className="flex shrink-0 items-center gap-3 px-6 pt-8 lg:px-10 lg:pt-10">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center p-6 lg:p-10">
          <img
            src={illustration}
            alt=""
            className="max-h-[min(60vh,480px)] w-full max-w-md object-contain"
          />
        </div>
      </div>
      {/* Right column: form */}
      <div className="flex flex-1 flex-shrink-0 items-center justify-center bg-white dark:bg-slate-900 px-6 py-10 lg:px-16 lg:py-12">
        {children}
      </div>
    </div>
  )
}
