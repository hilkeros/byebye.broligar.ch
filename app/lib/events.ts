import { getLang } from './lang.svelte'
import { t } from './t'

export function locationInfo(locations: any[] | undefined): { label: string; url: string } | null {
  if (!locations?.length) return null
  const loc = locations[0]
  const venueName = loc.name && (loc.name.match(/,/g)?.length ?? 0) <= 2 ? loc.name : ''
  const label = [venueName, loc.street, loc.locality, loc.country]
    .filter(Boolean)
    .join(', ')
  if (!label) return null
  return {
    label,
    url: `https://maps.google.com/?q=${encodeURIComponent(label)}`,
  }
}

export function formatDateRange(start: string | undefined, end: string | undefined): string | null {
  if (!start) return null
  const locale = getLang()
  const s = new Date(start)
  const startStr = s.toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' })
  if (!end) return startStr
  const e = new Date(end)
  const sameDay = s.toDateString() === e.toDateString()
  const endStr = sameDay
    ? e.toLocaleTimeString(locale, { timeStyle: 'short' })
    : e.toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' })
  return `${startStr} – ${endStr}`
}

export function modeLabel(mode: string): string {
  const labels: Record<string, string> = {
    'community.lexicon.calendar.event#inperson': t('In person'),
    'community.lexicon.calendar.event#virtual': t('Virtual'),
    'community.lexicon.calendar.event#hybrid': t('Hybrid'),
  }
  return labels[mode] ?? mode
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    'community.lexicon.calendar.event#scheduled': t('Scheduled'),
    'community.lexicon.calendar.event#planned': t('Planned'),
    'community.lexicon.calendar.event#cancelled': t('Cancelled'),
    'community.lexicon.calendar.event#postponed': t('Postponed'),
    'community.lexicon.calendar.event#rescheduled': t('Rescheduled'),
  }
  return labels[status] ?? status
}
