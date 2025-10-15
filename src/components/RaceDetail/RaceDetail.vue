<script setup lang="ts">
import { computed } from 'vue'
import type { RaceSummary } from '@/types/race'

interface Props {
  show: boolean
  race: RaceSummary | null
}

const props = defineProps<Props>()
defineEmits<{
  close: []
}>()

const formattedStartTime = computed(() => {
  if (!props.race) return ''
  const date = new Date(props.race.advertised_start.seconds * 1000)
  return date.toLocaleString()
})
</script>

<style>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: scale(0.9);
}
</style>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show && race" class="overlay" @click="$emit('close')">
        <div class="modal" @click.stop>
          <div class="header">
            <h2 class="title">{{ race.race_name }}</h2>
            <button class="close-btn" @click="$emit('close')">×</button>
          </div>

          <div class="content">
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Venue</span>
                <span class="value">
                  {{ race.venue_name }}, {{ race.venue_state }}
                </span>
              </div>

              <div class="info-item">
                <span class="label">Race Number</span>
                <span class="value">R{{ race.race_number }}</span>
              </div>

              <div v-if="race.race_form?.distance" class="info-item">
                <span class="label">Distance</span>
                <span class="value">
                  {{ race.race_form.distance }}{{ race.race_form.distance_type?.short_name || 'm' }}
                </span>
              </div>

              <div v-if="race.race_form?.track_condition" class="info-item">
                <span class="label">Track Condition</span>
                <span class="value">{{ race.race_form.track_condition.name }}</span>
              </div>

              <div v-if="race.race_form?.weather" class="info-item">
                <span class="label">Weather</span>
                <span class="value">{{ race.race_form.weather.name }}</span>
              </div>

              <div class="info-item">
                <span class="label">Start Time</span>
                <span class="value">{{ formattedStartTime }}</span>
              </div>
            </div>

            <div v-if="race.race_form?.race_comment" class="comment">
              <h3 class="comment-title">Race Comment</h3>
              <p class="comment-text">{{ race.race_form.race_comment }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@import "@/assets/variables.scss";

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-lg;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.modal {
  background: $bg-color-white;
  border-radius: $radius-xl;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-xl $space-2xl;
  border-bottom: 1px solid $border-color-light;
  background: $bg-color-lighter;
}

.title {
  margin: 0;
  font-size: $text-size-3xl;
  font-weight: $font-weight-bold;
  color: $text-color-primary;
  flex: 1;
  padding-right: $space-lg;
}

.close-btn {
  background: none;
  border: none;
  font-size: 32px;
  line-height: 1;
  color: $text-color-tertiary;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-sm;
  transition: all $transition-fast;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: $text-color-primary;
  }

  &:active {
    transform: scale(0.95);
  }
}

.content {
  padding: $space-2xl;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $space-lg;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: $space-xs;
}

.label {
  font-size: $text-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-color-secondary;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value {
  font-size: $text-size-lg;
  font-weight: $font-weight-medium;
  color: $text-color-primary;
}

.comment {
  margin-top: $space-2xl;
  padding-top: $space-2xl;
  border-top: 1px solid $border-color-lighter;
}

.comment-title {
  margin: 0 0 $space-md 0;
  font-size: $text-size-lg;
  font-weight: $font-weight-semibold;
  color: $text-color-primary;
}

.comment-text {
  margin: 0;
  font-size: $text-size-base;
  line-height: 1.6;
  color: $text-color-secondary;
}

@media (max-width: 768px) {
  .overlay {
    padding: $space-md;
  }

  .modal {
    max-height: 95vh;
  }

  .header {
    padding: $space-lg;
  }

  .title {
    font-size: $text-size-xl;
    padding-right: $space-md;
  }

  .close-btn {
    font-size: 28px;
    width: 28px;
    height: 28px;
  }

  .content {
    padding: $space-lg;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: $space-md;
  }

  .comment {
    margin-top: $space-lg;
    padding-top: $space-lg;
  }
}
</style>
