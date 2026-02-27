/**
 * Shared date/time formatting: day, month, year and 24-hour time.
 * Use for all date displays across tables and pages.
 */

const DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}

const DATE_ONLY_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
}

/** Locale that yields DD/MM/YYYY and 24h time consistently. */
const FORMAT_LOCALE = 'en-GB'

/**
 * Format an ISO date-time string as DD/MM/YYYY, HH:mm (24-hour).
 * Returns the original string if invalid.
 */
export function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleString(FORMAT_LOCALE, DATE_TIME_OPTIONS)
  } catch {
    return iso
  }
}

/**
 * Format an ISO date string as DD/MM/YYYY (date only).
 * Returns "—" for null or invalid.
 */
export function formatDate(iso: string | null): string {
  if (iso == null || iso === '') return '—'
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleDateString(FORMAT_LOCALE, DATE_ONLY_OPTIONS)
  } catch {
    return '—'
  }
}
