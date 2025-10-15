<script setup lang="ts">
import type { RaceSummary } from '@/types/race'
import RaceChip from '../RaceChip/RaceChip.vue'

interface Props {
  venue: string
  state: string
  races: RaceSummary[]
}

defineProps<Props>()
defineEmits<{
  raceClick: [race: RaceSummary]
}>()
</script>

<template>
  <div class="row">
    <div class="info">
      <div class="name">{{ venue }}</div>
      <div class="state">{{ state }}</div>
    </div>
    <div class="races">
      <RaceChip
        v-for="race in races"
        :key="race.race_id"
        :race="race"
        @click="$emit('raceClick', race)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.scss";

.row {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: $space-md;
  padding: $space-xs 0;
  border-bottom: 1px solid $border-color-lighter;

  &:last-child {
    border-bottom: none;
  }
}

.info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding-top: $space-xs;
}

.name {
  font-size: $text-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-color-primary;
  line-height: 1.2;
}

.state {
  font-size: $text-size-xs;
  color: $text-color-tertiary;
  font-weight: $font-weight-medium;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.races {
  display: flex;
  gap: $space-xs;
  flex-wrap: wrap;
  align-items: flex-start;
}

@media (max-width: 768px) {
  .row {
    grid-template-columns: 1fr;
    gap: $space-sm;
    padding: $space-sm 0;
  }

  .races {
    gap: $space-xs;
  }
}
</style>
