<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRaceStore } from './stores/raceStore'
import UpcomingRacesSidebar from './components/UpcomingRacesSidebar/UpcomingRacesSidebar.vue'
import CountryFilter from './components/CountryFilter/CountryFilter.vue'
import CategoryFilter from './components/CategoryFilter/CategoryFilter.vue'
import VenueRow from './components/VenueRow/VenueRow.vue'
import RaceDetail from './components/RaceDetail/RaceDetail.vue'
import type { RaceSummary } from './types/race'

const raceStore = useRaceStore()

// Modal state
const showRaceModal = ref(false)
const selectedRace = ref<RaceSummary | null>(null)

function openRaceModal(race: RaceSummary) {
  selectedRace.value = race
  showRaceModal.value = true
}

function closeRaceModal() {
  showRaceModal.value = false
  selectedRace.value = null
}

// Update filters height for sticky positioning
async function updateFiltersHeight() {
  await nextTick()
  const filterEl = document.querySelector('.filters-section') as HTMLElement
  const containerEl = document.querySelector('.main-container') as HTMLElement
  if (filterEl && containerEl) {
    const height = filterEl.offsetHeight
    containerEl.style.setProperty('--filters-height', `${height}px`)
  }
}

onMounted(() => {
  raceStore.startAutoRefresh()

  // Set filters height for sticky section titles
  setTimeout(updateFiltersHeight, 100)
  window.addEventListener('resize', updateFiltersHeight)
})

onUnmounted(() => {
  raceStore.stopAutoRefresh()
  window.removeEventListener('resize', updateFiltersHeight)
})
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="logo">
        <span class="logo-text">Stan's Racing Board</span>
      </div>
    </header>

    <div class="main-content">
      <UpcomingRacesSidebar
        v-if="!raceStore.loading && raceStore.races.length > 0"
        @race-click="openRaceModal"
      />

      <div class="scrollable-content">
        <div v-if="raceStore.loading" class="loading">Loading races...</div>

        <div v-else-if="raceStore.error" class="error-state">
          <div class="error-title">Error Loading Races</div>
          <div class="error-message">{{ raceStore.error }}</div>
          <button class="retry-btn" @click="raceStore.fetchRaces()">Retry</button>
        </div>

        <div v-else class="main-container">
          <div class="filters-section">
            <CountryFilter
              v-model="raceStore.selectedCountry"
              :available-countries="raceStore.availableCountries"
            />

            <CategoryFilter v-model="raceStore.selectedCategory" />
          </div>

          <div v-if="raceStore.groupedByCategory.length === 0" class="empty-state">
            No upcoming races available
          </div>

          <div v-else class="races-content">
            <section
              v-for="category in raceStore.groupedByCategory"
              :key="category.categoryId"
              :id="category.categoryId"
              class="race-section"
            >
              <h2 class="section-title">{{ category.name }}</h2>

              <div class="venues-list">
                <VenueRow
                  v-for="(venue, index) in category.venues"
                  :key="`${venue.venue}-${venue.state}-${index}`"
                  :venue="venue.venue"
                  :state="venue.state"
                  :races="venue.races"
                  @race-click="openRaceModal"
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>

    <RaceDetail :show="showRaceModal" :race="selectedRace" @close="closeRaceModal" />
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.scss";

.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $bg-color-light;
}

.header {
  background: $color-primary;
  color: $text-color-white-100;
  padding: $space-md $space-2xl;
  box-shadow: $shadow-md;
  flex-shrink: 0;
}

.logo-text {
  font-size: $text-size-2xl;
  font-weight: $font-weight-bold;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  max-width: 1660px;
  width: 100%;
  margin: 0 auto;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.loading,
.empty {
  text-align: center;
  padding: $space-2xl $space-lg;
  color: $text-color-secondary;
  font-size: $text-size-lg;
  margin: $space-lg;
}

.empty-state {
  text-align: center;
  padding: $space-2xl $space-lg;
  color: $text-color-secondary;
  font-size: $text-size-lg;
}

.error-state {
  text-align: center;
  padding: $space-3xl $space-lg;
  margin: $space-lg;
  background: $bg-color-white;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
}

.error-title {
  font-size: $text-size-2xl;
  font-weight: $font-weight-bold;
  color: $text-color-primary;
  margin-bottom: $space-md;
}

.error-message {
  color: $color-urgent;
  font-size: $text-size-base;
  margin-bottom: $space-xl;
}

.retry-btn {
  padding: $space-md $space-2xl;
  background: $color-primary;
  border: none;
  border-radius: $radius-md;
  color: $text-color-white-100;
  font-size: $text-size-base;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: $color-primary-dark;
  }

  &:active {
    transform: scale(0.98);
  }
}

.main-container {
  background: $bg-color-white;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  margin: $space-lg;

  // CSS variable for filters height
  --filters-height: 86px;
}

.filters-section {
  position: sticky;
  top: 0;
  z-index: 10;
  background: $bg-color-white;
  padding: $space-md $space-xl;
  display: flex;
  flex-direction: column;
  gap: $space-md;
  border-bottom: 2px solid $bg-color-light;
  border-radius: $radius-md $radius-md 0 0;
}

.race-section {
  padding: 0 $space-2xl $space-xl $space-2xl;

  &:not(:last-child) {
    border-bottom: 2px solid $bg-color-light;
  }
}

.section-title {
  position: sticky;
  // Use CSS variable to stick right below the filters
  top: var(--filters-height);
  z-index: 5;
  background: $bg-color-white;
  margin: 0;
  padding: $space-md $space-2xl;
  margin-left: -$space-2xl;
  margin-right: -$space-2xl;
  margin-bottom: $space-lg;
  font-size: $text-size-2xl;
  font-weight: $font-weight-bold;
  color: $text-color-primary;
  border-bottom: 1px solid $border-color-lighter;

  // Add shadow when it becomes sticky
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
}

.venues-list {
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .header {
    padding: $space-sm $space-md;
  }

  .logo-text {
    font-size: $text-size-lg;
  }

  .scrollable-content {
    padding: 0;
  }

  .main-container {
    margin: $space-md;
    border-radius: $radius-sm;
  }

  .loading,
  .empty {
    margin: $space-md;
  }

  .filters-section {
    padding: $space-sm $space-md;
    gap: $space-sm;
  }

  .race-section {
    padding: 0 $space-md $space-lg $space-md;
  }

  .section-title {
    font-size: $text-size-lg;
    margin-bottom: $space-md;
    padding: $space-sm $space-md;
    margin-left: -$space-md;
    margin-right: -$space-md;
  }
}
</style>
