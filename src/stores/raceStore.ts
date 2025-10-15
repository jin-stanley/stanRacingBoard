import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { racingApi } from '@/services/api'
import { getRaceStatus, getCategoryName } from '@/utils/time'
import type { RaceSummary, CategoryId, CategoryGroup, VenueGroup, CountryFilter } from '@/types/race'
import { CATEGORIES } from '@/types/race'

export const useRaceStore = defineStore('race', () => {
  // State
  const races = ref<RaceSummary[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedCategory = ref<CategoryId | 'all'>('all')
  const selectedCountry = ref<CountryFilter>('AUS')

  // Computed
  const activeRaces = computed(() => {
    // Filter out races that finished more than 60 seconds ago
    return races.value.filter((race) => {
      const status = getRaceStatus(race.advertised_start.seconds)
      return status !== 'finished'
    })
  })

  const filteredRaces = computed(() => {
    let racesToFilter = activeRaces.value

    // Filter by country
    if (selectedCountry.value !== 'all') {
      racesToFilter = racesToFilter.filter((race) => race.venue_country === selectedCountry.value)
    }

    // Filter by category
    if (selectedCategory.value !== 'all') {
      racesToFilter = racesToFilter.filter((race) => race.category_id === selectedCategory.value)
    }

    return racesToFilter
  })

  const availableCountries = computed(() => {
    const countries = new Set<string>()
    activeRaces.value.forEach((race) => {
      countries.add(race.venue_country)
    })
    return Array.from(countries).sort()
  })

  const nextToGoRaces = computed(() => {
    // Get next 5 races sorted by start time
    return [...activeRaces.value]
      .sort((a, b) => a.advertised_start.seconds - b.advertised_start.seconds)
      .slice(0, 5)
  })

  const groupedByCategory = computed((): CategoryGroup[] => {
    const racesToGroup = filteredRaces.value

    // Group by category
    const categoryMap = new Map<CategoryId, RaceSummary[]>()

    racesToGroup.forEach((race) => {
      const categoryId = race.category_id as CategoryId
      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, [])
      }
      categoryMap.get(categoryId)!.push(race)
    })

    // Convert to CategoryGroup array
    const categories: CategoryGroup[] = []

    categoryMap.forEach((races, categoryId) => {
      // Group races by venue
      const venueMap = new Map<string, RaceSummary[]>()

      races.forEach((race) => {
        const venueKey = `${race.venue_name}|${race.venue_state}`
        if (!venueMap.has(venueKey)) {
          venueMap.set(venueKey, [])
        }
        venueMap.get(venueKey)!.push(race)
      })

      // Convert to VenueGroup array
      const venues: VenueGroup[] = []
      venueMap.forEach((venueRaces, venueKey) => {
        const [venue = '', state = ''] = venueKey.split('|')
        venues.push({
          venue,
          state,
          races: venueRaces.sort((a, b) => a.race_number - b.race_number)
        })
      })

      categories.push({
        name: getCategoryName(categoryId),
        categoryId,
        venues: venues.sort((a, b) => a.venue.localeCompare(b.venue))
      })
    })

    // Sort categories: Horse → Greyhound → Harness
    const order = [CATEGORIES.HORSE_RACING, CATEGORIES.GREYHOUND_RACING, CATEGORIES.HARNESS_RACING]
    return categories.sort((a, b) => order.indexOf(a.categoryId) - order.indexOf(b.categoryId))
  })

  // Actions
  async function fetchRaces(count: number = 100) {
    loading.value = true
    error.value = null

    try {
      const response = await racingApi.getNextRaces(count)
      const raceSummaries = response.data.race_summaries

      // Convert object to array
      races.value = Object.values(raceSummaries)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch races'
      console.error('Error fetching races:', err)
    } finally {
      loading.value = false
    }
  }

  // Auto refresh
  let refreshTimer: number | null = null

  function startAutoRefresh() {
    // Initial fetch
    fetchRaces()

    // Refresh every 60 seconds
    refreshTimer = window.setInterval(() => {
      fetchRaces()
    }, 60000)
  }

  function stopAutoRefresh() {
    if (refreshTimer !== null) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }

  function setCategory(category: CategoryId | 'all') {
    selectedCategory.value = category
  }

  function setCountry(country: CountryFilter) {
    selectedCountry.value = country
  }

  return {
    // State
    races,
    loading,
    error,
    selectedCategory,
    selectedCountry,
    // Computed
    activeRaces,
    filteredRaces,
    nextToGoRaces,
    groupedByCategory,
    availableCountries,
    // Actions
    fetchRaces,
    startAutoRefresh,
    stopAutoRefresh,
    setCategory,
    setCountry
  }
})
