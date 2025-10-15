import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatCountdown, getRaceStatus, getCategoryName } from '../time'
import { CATEGORIES } from '@/types/race'

describe('time utilities', () => {
  describe('formatCountdown', () => {
    it('should format different time ranges correctly', () => {
      expect(formatCountdown(30)).toBe('30s')
      expect(formatCountdown(90)).toBe('1m 30s')
      expect(formatCountdown(600)).toBe('10m')
      expect(formatCountdown(-30)).toBe('-30s')
    })
  })

  describe('getRaceStatus', () => {
    beforeEach(() => {
      vi.setSystemTime(new Date('2024-01-01T10:00:00'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should return correct status for different race times', () => {
      const futureTime = new Date('2024-01-01T10:05:00').getTime() / 1000
      const justStarted = new Date('2024-01-01T09:59:30').getTime() / 1000
      const finished = new Date('2024-01-01T09:58:00').getTime() / 1000

      expect(getRaceStatus(futureTime)).toBe('upcoming')
      expect(getRaceStatus(justStarted)).toBe('started')
      expect(getRaceStatus(finished)).toBe('finished')
    })
  })

  describe('getCategoryName', () => {
    it('should return correct category names', () => {
      expect(getCategoryName(CATEGORIES.HORSE_RACING)).toBe('Horse Racing')
      expect(getCategoryName(CATEGORIES.GREYHOUND_RACING)).toBe('Greyhound Racing')
      expect(getCategoryName('invalid-id')).toBe('Unknown')
    })
  })
})
