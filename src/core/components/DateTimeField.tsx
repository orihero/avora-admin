import { useEffect, useState } from 'react'
import { cn } from './cn'

const inputStyles = cn(
  'rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900',
  'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
  'dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100'
)

function parseValue(value: string): { date: string; time: string } {
  if (!value || !value.includes('T')) {
    return { date: '', time: '' }
  }
  const [datePart, timePart] = value.split('T')
  const time = (timePart || '00:00').slice(0, 5)
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(datePart)
  const validTime = /^\d{1,2}:\d{2}$/.test(time)
  return {
    date: validDate ? datePart : '',
    time: validTime ? normalizeTime(time) : '00:00',
  }
}

/** Normalize to HH:mm (24-hour), clamp hour 0-23 and minute 0-59. */
function normalizeTime(t: string): string {
  const [h, m] = t.split(':').map((s) => parseInt(s, 10))
  const hour = Number.isNaN(h) ? 0 : Math.min(23, Math.max(0, h))
  const min = Number.isNaN(m) ? 0 : Math.min(59, Math.max(0, m))
  return `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}

function buildValue(date: string, time: string): string {
  if (!date || !time) return ''
  return `${date}T${normalizeTime(time)}`
}

/** Format YYYY-MM-DD as DD-MM-YYYY for display. */
function toDisplayDate(isoDate: string): string {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return ''
  const [y, m, d] = isoDate.split('-')
  return `${d}-${m}-${y}`
}

/** Parse DD-MM-YYYY or D-M-YYYY (with - or /) to YYYY-MM-DD. */
function fromDisplayDate(display: string): string {
  const cleaned = display.trim().replace(/\//g, '-')
  const parts = cleaned.split('-').map((p) => p.trim())
  if (parts.length !== 3) return ''
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10)
  let year = parseInt(parts[2], 10)
  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return ''
  if (year < 100) year += year < 50 ? 2000 : 1900
  if (month < 1 || month > 12 || day < 1 || day > 31) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${year}-${pad(month)}-${pad(day)}`
}

export interface DateTimeFieldProps {
  value: string
  onChange: (value: string) => void
  required?: boolean
  className?: string
}

/** Single date input + single time input (24-hour). Value format: YYYY-MM-DDTHH:mm. Date is displayed as DD-MM-YYYY. */
export function DateTimeField({
  value,
  onChange,
  required = false,
  className,
}: DateTimeFieldProps) {
  const parsed = parseValue(value)
  const [date, setDate] = useState(parsed.date)
  const [dateDisplay, setDateDisplay] = useState(toDisplayDate(parsed.date))
  const [time, setTime] = useState(parsed.time)

  useEffect(() => {
    const p = parseValue(value)
    setDate(p.date)
    setDateDisplay(toDisplayDate(p.date))
    setTime(p.time)
  }, [value])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setDateDisplay(v)
    const iso = fromDisplayDate(v)
    if (iso) {
      setDate(iso)
      onChange(buildValue(iso, time || '00:00'))
    }
  }

  const handleDateBlur = () => {
    const iso = fromDisplayDate(dateDisplay)
    if (iso) {
      setDate(iso)
      setDateDisplay(toDisplayDate(iso))
      onChange(buildValue(iso, time || '00:00'))
    } else if (date) {
      setDateDisplay(toDisplayDate(date))
    }
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setTime(v)
    const normalized = normalizeTime(v)
    if (date && /^\d{1,2}:\d{2}$/.test(v)) onChange(buildValue(date, normalized))
  }

  const handleTimeBlur = () => {
    const normalized = normalizeTime(time)
    if (normalized !== time) {
      setTime(normalized)
      if (date) onChange(buildValue(date, normalized))
    }
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <input
        type="text"
        value={dateDisplay}
        onChange={handleDateChange}
        onBlur={handleDateBlur}
        placeholder="DD-MM-YYYY"
        className={cn(inputStyles, 'min-w-[120px]')}
        required={required}
        aria-label="Date (day-month-year)"
      />
      <input
        type="text"
        inputMode="numeric"
        placeholder="HH:mm"
        value={time}
        onChange={(e) => handleTimeChange(e)}
        onBlur={handleTimeBlur}
        className={cn(inputStyles, 'w-[72px] font-mono')}
        required={required}
        aria-label="Time (24-hour)"
        maxLength={5}
        title="24-hour format (e.g. 14:30)"
      />
    </div>
  )
}
