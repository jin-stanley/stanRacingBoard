import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRaceStore } from '../raceStore'
import { CATEGORIES } from '@/types/race'
import type { RaceSummary } from '@/types/race'

vi.mock('@/services/api', () => ({
  racingApi: {
    getNextRaces: vi.fn()
  }
}))

vi.mock('@/utils/time', async () => {
  const actual = await vi.importActual('@/utils/time')
  return {
    ...actual,
    getRaceStatus: vi.fn((startTimeSeconds: number) => {
      const now = Date.now() / 1000
      const diff = now - startTimeSeconds
      if (diff < 0) return 'upcoming'
      if (diff <= 60) return 'started'
      return 'finished'
    })
  }
})

describe('raceStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const createMockRace = (overrides: Partial<RaceSummary> = {}): RaceSummary => ({
    race_id: '123',
    race_name: 'Test Race',
    race_number: 1,
    meeting_id: 'meeting-1',
    meeting_name: 'Test Meeting',
    category_id: CATEGORIES.HORSE_RACING,
    advertised_start: {
      seconds: Math.floor(Date.now() / 1000) + 300
    },
    race_form: {
      distance: 1200,
      distance_type: { id: '1', name: 'Metres', short_name: 'm' },
      distance_type_id: '1',
      track_condition: { id: '1', name: 'Good', short_name: 'G' },
      track_condition_id: '1',
      weather: { id: '1', name: 'Fine', short_name: 'F', icon_uri: '' },
      weather_id: '1'
    },
    venue_id: 'venue-1',
    venue_name: 'Test Venue',
    venue_state: 'VIC',
    venue_country: 'AUS',
    ...overrides
  })

  it('should filter races by category', () => {
    const store = useRaceStore()
    store.races = [
      createMockRace({ race_id: '1', category_id: CATEGORIES.HORSE_RACING }),
      createMockRace({ race_id: '2', category_id: CATEGORIES.GREYHOUND_RACING })
    ]

    store.setCategory(CATEGORIES.HORSE_RACING)
    expect(store.filteredRaces).toHaveLength(1)
    expect(store.filteredRaces[0]?.category_id).toBe(CATEGORIES.HORSE_RACING)
  })

  it('should filter races by country', () => {
    const store = useRaceStore()
    store.races = [
      createMockRace({ race_id: '1', venue_country: 'AUS' }),
      createMockRace({ race_id: '2', venue_country: 'NZ' })
    ]

    store.setCountry('AUS')
    expect(store.filteredRaces).toHaveLength(1)
    expect(store.filteredRaces[0]?.venue_country).toBe('AUS')
  })

  it('should return next 5 races sorted by time', () => {
    const store = useRaceStore()
    const now = Math.floor(Date.now() / 1000)

    store.races = [
      createMockRace({ race_id: '3', advertised_start: { seconds: now + 900 } }),
      createMockRace({ race_id: '1', advertised_start: { seconds: now + 300 } }),
      createMockRace({ race_id: '2', advertised_start: { seconds: now + 600 } })
    ]

    const nextRaces = store.nextToGoRaces
    expect(nextRaces).toHaveLength(3)
    expect(nextRaces[0]?.race_id).toBe('1')
    expect(nextRaces[2]?.race_id).toBe('3')
  })

  it('should group races by category and venue', () => {
    const store = useRaceStore()
    store.races = [
      createMockRace({
        race_id: '1',
        category_id: CATEGORIES.HORSE_RACING,
        venue_name: 'Flemington',
        race_number: 1
      }),
      createMockRace({
        race_id: '2',
        category_id: CATEGORIES.HORSE_RACING,
        venue_name: 'Flemington',
        race_number: 2
      })
    ]

    const grouped = store.groupedByCategory
    expect(grouped).toHaveLength(1)
    expect(grouped[0]?.categoryId).toBe(CATEGORIES.HORSE_RACING)
    expect(grouped[0]?.venues[0]?.races).toHaveLength(2)
  })
})
