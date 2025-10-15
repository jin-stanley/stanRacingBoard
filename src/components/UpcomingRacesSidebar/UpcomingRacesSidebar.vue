<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRaceStore } from '@/stores/raceStore'
import { formatCountdown, getCountdownSeconds } from '@/utils/time'
import { CATEGORIES } from '@/types/race'
import type { RaceSummary } from '@/types/race'

defineEmits<{
  'race-click': [race: RaceSummary]
}>()

const raceStore = useRaceStore()
const currentTime = ref(Date.now())
const displayCount = ref(10)

// Get upcoming races sorted by start time
const allUpcomingRaces = computed(() => {
  return raceStore.races
    .filter(race => {
      const countdown = getCountdownSeconds(race.advertised_start.seconds)
      return countdown > -60 // Only show races that haven't finished (within 1 min)
    })
    .sort((a, b) => a.advertised_start.seconds - b.advertised_start.seconds)
})

// Display limited number of races
const upcomingRaces = computed(() => {
  return allUpcomingRaces.value.slice(0, displayCount.value)
})

// Check if there are more races to load
const hasMore = computed(() => {
  return allUpcomingRaces.value.length > displayCount.value
})

function loadMore() {
  displayCount.value += 5
}

function getCategoryDotClass(categoryId: string): string {
  const classes: Record<string, string> = {
    [CATEGORIES.HORSE_RACING]: 'horse',
    [CATEGORIES.GREYHOUND_RACING]: 'greyhound',
    [CATEGORIES.HARNESS_RACING]: 'harness'
  }
  return classes[categoryId] || ''
}

function getCategoryHoverClass(categoryId: string): string {
  const classes: Record<string, string> = {
    [CATEGORIES.HORSE_RACING]: 'horse-hover',
    [CATEGORIES.GREYHOUND_RACING]: 'greyhound-hover',
    [CATEGORIES.HARNESS_RACING]: 'harness-hover'
  }
  return classes[categoryId] || ''
}

function getCountdownText(race: RaceSummary): string {
  // Force reactivity by accessing currentTime
  void currentTime.value

  const countdown = getCountdownSeconds(race.advertised_start.seconds)

  if (countdown < 0) {
    return 'Started'
  }

  return formatCountdown(countdown)
}

function getCountdownStyleClass(race: RaceSummary): string {
  // Force reactivity by accessing currentTime
  void currentTime.value

  const countdown = getCountdownSeconds(race.advertised_start.seconds)

  if (countdown < 0) {
    return 'started'
  } else if (countdown < 60) {
    return 'imminent'
  } else if (countdown < 300) {
    return 'soon'
  }

  return ''
}

// Update current time every second for countdown
let timer: number | null = null

onMounted(() => {
  timer = window.setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timer !== null) {
    clearInterval(timer)
  }
})
</script>

<template>
  <aside class="sidebar">
    <div class="header">
      <h3 class="title">Next To Go</h3>
    </div>

    <div class="races">
      <div
        v-for="race in upcomingRaces"
        :key="race.race_id"
        :class="['race-item', getCategoryHoverClass(race.category_id)]"
        @click="$emit('race-click', race)"
      >
        <div :class="['category-dot', getCategoryDotClass(race.category_id)]"></div>
        <div class="info">
          <div class="name">{{ race.meeting_name }}</div>
          <div class="number">R{{ race.race_number }}</div>
        </div>
        <div :class="['countdown', getCountdownStyleClass(race)]">
          {{ getCountdownText(race) }}
        </div>
      </div>

      <div v-if="upcomingRaces.length === 0" class="no-races">
        No upcoming races
      </div>
    </div>

    <div class="legend">
      <div class="legend-items">
        <div class="legend-item">
          <div class="legend-dot greyhound"></div>
          <span class="legend-label">Greyhound</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot harness"></div>
          <span class="legend-label">Harness</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot horse"></div>
          <span class="legend-label">Horse</span>
        </div>
      </div>
    </div>

    <div v-if="hasMore" class="footer">
      <button class="load-more-btn" @click="loadMore">
        Load More
      </button>
    </div>
  </aside>
</template>

<style scoped lang="scss">
@import "@/assets/variables.scss";

.sidebar {
  display: flex;
  flex-direction: column;
  background: $bg-color-white;
  border: 1px solid $border-color-light;
  border-radius: 0;
  overflow: hidden;
  align-self: stretch;
}

.header {
  padding: $space-lg;
  border-bottom: 1px solid $border-color-light;
  background: $bg-color-lighter;
}

.title {
  margin: 0;
  font-size: $text-size-2xl;
  font-weight: $font-weight-bold;
  color: $text-color-primary;
}

.races {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
}

.race-item {
  display: flex;
  align-items: center;
  gap: $space-sm;
  padding: $space-sm $space-md;
  border-bottom: 1px solid $border-color-lighter;
  cursor: pointer;
  transition: background-color $transition-fast;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: $bg-color-lighter;
  }
}

.category-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.greyhound {
  background-color: #28a745;
}

.harness {
  background-color: #ffc107;
}

.horse {
  background-color: #dc3545;
}

.greyhound-hover:hover {
  background-color: rgba(40, 167, 69, 0.1);
}

.harness-hover:hover {
  background-color: rgba(255, 193, 7, 0.1);
}

.horse-hover:hover {
  background-color: rgba(220, 53, 69, 0.1);
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.name {
  font-size: $text-size-base;
  font-weight: $font-weight-semibold;
  color: $text-color-primary;
  line-height: 1.2;
}

.number {
  font-size: $text-size-xs;
  color: $text-color-secondary;
  font-weight: $font-weight-medium;
  line-height: 1.2;
}

.countdown {
  font-size: $text-size-base;
  font-weight: $font-weight-bold;
  color: $text-color-primary;
  min-width: 55px;
  text-align: right;
}

.started {
  color: $color-urgent;
  font-weight: $font-weight-bold;
}

.imminent {
  color: $color-urgent;
}

.soon {
  color: $color-warning;
}

.no-races {
  padding: $space-3xl $space-lg;
  text-align: center;
  color: $text-color-tertiary;
  font-size: $text-size-base;
}

.legend {
  padding: $space-md $space-lg;
  background: $bg-color-lighter;
  border-top: 1px solid $border-color-light;
}

.legend-items {
  display: flex;
  gap: $space-lg;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: $space-sm;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  font-size: $text-size-sm;
  color: $text-color-secondary;
  font-weight: $font-weight-medium;
}

.footer {
  padding: $space-md $space-lg;
  border-top: 1px solid $border-color-light;
}

.load-more-btn {
  width: 100%;
  padding: $space-md;
  background: $color-primary;
  border: 1px solid $color-primary;
  border-radius: 0;
  color: $text-color-white-100;
  font-size: $text-size-base;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: $color-primary-dark;
    border-color: $color-primary-dark;
  }

  &:active {
    transform: scale(0.98);
  }
}

@media (max-width: 768px) {
  .sidebar {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }

  .header {
    padding: $space-md;
  }

  .title {
    font-size: $text-size-xl;
  }

  .race-item {
    padding: $space-sm;
    gap: $space-xs;
  }

  .legend {
    padding: $space-md;
  }

  .legend-items {
    gap: $space-md;
  }
}
</style>
