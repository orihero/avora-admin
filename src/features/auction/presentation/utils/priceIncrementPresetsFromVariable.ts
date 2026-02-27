export const PRICE_INCREMENT_PRESETS_VARIABLE_KEY = 'price_increment_presets'

/**
 * Parses the system variable value for price increment presets into
 * an array of "value:label" strings used by auction products.
 * - Numbers only: "10,50,100,500" → ["10:10", "50:50", "100:100", "500:500"]
 * - Value:label pairs: "10:+$10,50:+$50" → used as-is per segment (after trim)
 */
export function parsePriceIncrementPresetsVariable(value: string | undefined): string[] {
  if (value == null || typeof value !== 'string') return []
  const trimmed = value.trim()
  if (!trimmed) return []
  return trimmed.split(',').reduce<string[]>((acc, segment) => {
    const s = segment.trim()
    if (!s) return acc
    if (s.includes(':')) {
      acc.push(s)
      return acc
    }
    const num = Number(s)
    if (!Number.isNaN(num)) acc.push(`${num}:${num}`)
    return acc
  }, [])
}
