<script setup lang="ts">
import { computed } from 'vue'
import type { CountryFilter } from '@/types/race'

interface Props {
  modelValue: CountryFilter
  availableCountries: string[]
}

const props = defineProps<Props>()
defineEmits<{
  'update:modelValue': [value: CountryFilter]
}>()

const otherCountries = computed(() => {
  return props.availableCountries.filter((c) => c !== 'AUS')
})
</script>

<template>
  <div class="filter">
    <label class="label">Country:</label>
    <div class="buttons">
      <button
        :class="['btn', modelValue === 'all' ? 'active' : '']"
        @click="$emit('update:modelValue', 'all')"
      >
        All
      </button>
      <button
        :class="['btn', modelValue === 'AUS' ? 'active' : '']"
        @click="$emit('update:modelValue', 'AUS')"
      >
        AUS
      </button>
      <button
        v-for="country in otherCountries"
        :key="country"
        :class="['btn', modelValue === country ? 'active' : '']"
        @click="$emit('update:modelValue', country)"
      >
        {{ country }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.scss";

.filter {
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
  .filter {
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
