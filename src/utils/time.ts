import { CATEGORIES } from '@/types/race'
import type { RaceStatus } from '@/types/race'

export function formatCountdown(seconds: number): string {
  const absSeconds = Math.abs(seconds)
  const minutes = Math.floor(absSeconds / 60)
  const secs = Math.floor(absSeconds % 60)

  if (seconds < 0) {
    if (minutes === 0) return `-${secs}s`
    return `-${minutes}m ${secs}s`
  }

  // Show as clock time for > 30 min
  if (seconds > 1800) {
    const date = new Date(Date.now() + seconds * 1000)
    const hours = date.getHours()
    const mins = date.getMinutes()
    const ampm = hours >= 12 ? 'pm' : 'am'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${mins.toString().padStart(2, '0')}${ampm}`
  }

  if (seconds > 300) return `${minutes}m`
  if (minutes > 0) return `${minutes}m ${secs}s`
  return `${secs}s`
}

export function getRaceStatus(startTimeSeconds: number): RaceStatus {
  const now = Date.now() / 1000
  const diff = now - startTimeSeconds

  if (diff < 0) return 'upcoming'
  if (diff <= 60) return 'started'
  return 'finished'
}

export function getCountdownSeconds(startTimeSeconds: number): number {
  const now = Date.now() / 1000
  return startTimeSeconds - now
}

export function getCategoryName(categoryId: string): string {
  const map: Record<string, string> = {
    [CATEGORIES.HORSE_RACING]: 'Horse Racing',
    [CATEGORIES.GREYHOUND_RACING]: 'Greyhound Racing',
    [CATEGORIES.HARNESS_RACING]: 'Harness Racing'
  }
  return map[categoryId] || 'Unknown'
}

export function getCountdownClass(seconds: number): string {
  if (seconds < -60) return 'closed'
  if (seconds < 0) return 'started'
  if (seconds <= 60) return 'imminent'
  return 'upcoming'
}
