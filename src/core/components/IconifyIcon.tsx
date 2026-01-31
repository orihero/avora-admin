import { Icon } from '@iconify/react'
import { cn } from './cn'

interface IconifyIconProps {
  icon: string
  className?: string
  width?: number
  height?: number
}

export function IconifyIcon({
  icon,
  className,
  width = 24,
  height = 24,
}: IconifyIconProps) {
  return (
    <Icon
      icon={icon}
      width={width}
      height={height}
      className={cn('inline-block', className)}
    />
  )
}
