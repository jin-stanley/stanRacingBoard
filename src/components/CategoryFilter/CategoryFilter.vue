<script setup lang="ts">
import { CATEGORIES } from '@/types/race'
import type { CategoryId } from '@/types/race'

interface Props {
  modelValue: CategoryId | 'all'
}

defineProps<Props>()
defineEmits<{
  'update:modelValue': [value: CategoryId | 'all']
}>()

const categories = [
  { id: 'all' as const, label: 'All' },
  { id: CATEGORIES.HORSE_RACING, label: 'Horse Racing' },
  { id: CATEGORIES.GREYHOUND_RACING, label: 'Greyhounds' },
  { id: CATEGORIES.HARNESS_RACING, label: 'Harness' }
]
</script>

<template>
  <div class="filter-wrapper">
    <label class="label">Race Type:</label>
    <div class="buttons">
      <button
        v-for="category in categories"
        :key="category.id"
        :class="['btn', modelValue === category.id ? 'active' : '']"
        @click="$emit('update:modelValue', category.id)"
      >
        {{ category.label }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.scss";

.filter-wrapper {
  display: flex;
  align-items: center;
  gap: $space-md;
}

.label {
  font-size: $text-size-base;
  font-weight: $font-weight-semibold;
  color: $text-color-primary;
  white-space: nowrap;
}

.buttons {
  display: flex;
  gap: $space-sm;
  flex-wrap: wrap;
}

.btn {
  padding: $space-sm $space-lg;
  background: $bg-color-white;
  border: 1px solid $border-color-light;
  border-radius: $radius-md;
  color: $text-color-primary;
  font-size: $text-size-sm;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    border-color: $color-primary;
    color: $color-primary;
  }

  &.active {
    background: $color-primary;
    border-color: $color-primary;
    color: $text-color-white-100;

    &:hover {
      background: $color-primary-dark;
      border-color: $color-primary-dark;
    }
  }

  &:active {
    transform: scale(0.98);
  }
}

@media (max-width: 768px) {
  .filter-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: $space-sm;
  }

  .buttons {
    width: 100%;
  }

  .btn {
    padding: $space-sm $space-md;
    font-size: $text-size-xs;
  }
}
</style>
