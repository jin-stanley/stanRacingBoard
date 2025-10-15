<script setup lang="ts">
import { useCountdown } from '@/composables/useCountdown'
import type { RaceSummary } from '@/types/race'

interface Props {
  race: RaceSummary
}

const props = defineProps<Props>()
const emit = defineEmits<{
  click: [race: RaceSummary]
}>()

// Use composable for countdown logic
const { countdownText, countdownClass, isFinished } = useCountdown(
  props.race.advertised_start.seconds
)

function handleClick() {
  if (!isFinished.value) {
    emit('click', props.race)
  }
}
</script>

<template>
  <div :class="['chip', countdownClass, { closed: isFinished }]" @click="handleClick">
    <div class="number">R{{ race.race_number }}</div>
    <div class="countdown">{{ countdownText }}</div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.scss";

.chip {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 2px;
  background: $bg-color-white;
  border: 1px solid $border-color-light;
  border-radius: $radius-sm;
  padding: $space-sm;
  width: 80px;
  min-height: 50px;
  cursor: pointer;
  transition: $transition-fast;

  &:hover:not(.closed) {
    border-color: $color-primary;
    box-shadow: 0 1px 4px rgba($color-primary, 0.15);
  }
}

.number {
  font-size: $text-size-xs;
  font-weight: $font-weight-semibold;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.countdown {
  font-size: $text-size-base;
  font-weight: $font-weight-semibold;
  color: $text-color-primary;
}

.imminent {
  .countdown {
    color: $color-urgent;
  }
}

.started {
  .countdown {
    color: $color-urgent;
    font-weight: $font-weight-bold;
  }
}

.closed {
  opacity: 0.4;
  cursor: not-allowed;
  background: #fafafa;

  &:hover {
    border-color: $border-color-light;
    box-shadow: none;
  }

  .countdown {
    color: $text-color-tertiary;
  }
}

@media (max-width: 768px) {
  .chip {
    width: 70px;
    min-height: 46px;
    padding: 6px;
  }

  .number {
    font-size: 10px;
  }

  .countdown {
    font-size: $text-size-sm;
  }
}
</style>
